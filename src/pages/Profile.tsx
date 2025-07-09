import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PickerDate } from '@/components';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera } from 'lucide-react';
import { useAuthCredentials } from '@/context/auth';
import { useMutation, useQuery } from '@tanstack/react-query';
import { fetchWithToken } from '@/helpers/fetch';
import { useForm } from 'react-hook-form';
import { z, ZodTypeAny } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ESex } from '@/types/Patient';
import { format, parse } from 'date-fns';
import { cn } from '@/lib/utils';
import {
    formatPhoneNumber,
    phoneNumberValidator,
    resolveUserInfo,
} from '@/helpers';
import { Calendar } from '@/components/ui/calendar';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { US_CITIES, US_STATES } from '@/constants';
import { Separator } from '@/components/ui/separator';

const formSchema = z.object({
    fullName: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email address'),
    userId: z.string().min(1, 'User ID is required'),
    image: z.any().optional(), // or z.union([z.string(), z.instanceof(File)]).optional()
    countryCode: z.string().min(1, 'Country Code is required'),
    phone: z.string().transform(phoneNumberValidator),
    insuranceId: z.number({
        required_error: 'Insurance is required',
    }),
    address: z.object({
        street: z.string().min(1, 'Street is required'),
        city: z.string().min(1, 'City is required'),
        state: z.string().min(1, 'State is required'),
        postalCode: z.string().min(1, 'Postal code is required'),
        country: z.string().min(1, 'Country is required'),
    }),
    birthDate: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, 'Birth date is required'),
    sex: z.string().min(1, 'Sex is required'),
    emergencyContact: z.object({
        fullName: z.string().nonempty('Full name is required'),
        countryCode: z.string().min(1, 'Country Code is required'),
        phone: z
            .string()
            .nonempty('Phone is required')
            .transform(phoneNumberValidator),
    }),
});

const Profile = () => {
    const accessToken = useAuthCredentials((state) => state.accessToken);
    const user = resolveUserInfo(accessToken);
    const [isEditing, setIsEditing] = useState(false);

    const { data: patientData } = useQuery({
        queryKey: ['patient', user?._id],
        enabled: !!user?._id,
        queryFn: () => fetchWithToken(`/patient/${user?._id}`),
    });

    const { mutate: updateMutate } = useMutation({
        mutationKey: ['updatePatient', patientData?.id],
        mutationFn: async (data: z.infer<typeof formSchema>) => {
            const { image, ...rest } = data;
            return fetchWithToken(`/patient/${patientData?.id}`, rest, 'PUT');
        },
        onSuccess: (result, variables) => {
            console.log('updatePatient', { result, variables });
        },
    });

    const { mutate: createMutate } = useMutation({
        mutationKey: ['createPatient'],
        mutationFn: async (data: z.infer<typeof formSchema>) => {
            const { image, ...rest } = data;
            return fetchWithToken(`/patient`, rest, 'POST');
        },
        onSuccess: (result, variables) => {
            console.log('createPatient', { result, variables });
        },
    });

    const { data: insurancesData = [] } = useQuery({
        queryKey: ['insurances'],
        queryFn: () => fetchWithToken(`/doctor/insurances`),
        staleTime: Infinity,
        gcTime: Infinity,
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema as ZodTypeAny),
        defaultValues: {
            fullName: user?.fullName,
            email: user?.email,
            userId: user?._id,
            countryCode: '+1',
            phone: '',
            address: {
                street: '',
                city: '',
                state: '',
                postalCode: '',
                country: 'United States of America',
            },
            sex: ESex.MALE,
            birthDate: '',
            emergencyContact: {
                fullName: '',
                countryCode: '+1',
                phone: '',
            },
        },
    });

    const handleEdit = () => {
        form.reset();
        setIsEditing(!isEditing);
    };

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setIsEditing(false);
        if (patientData?.id) {
            updateMutate(values);
        } else {
            createMutate(values);
        }

        // 2) If there’s a new File in values.image, upload it first
        // if (values.image instanceof File) {
        //     const formData = new FormData();
        //     formData.append('image', values.image);
        //     await fetchWithToken(`/patient/${values.userId}/avatar`, {
        //         method: 'POST',
        //         body: formData,
        //     });
        // }
    };

    useEffect(() => {
        if (!patientData) {
            return;
        }
        form.reset({
            fullName: patientData.fullName ?? user?.fullName,
            email: patientData.email ?? user?.email,
            userId: patientData.userId ?? user?._id,
            image: patientData.image,
            countryCode: patientData.countryCode ?? '+1',
            phone: patientData.phone ?? '',
            insuranceId: patientData?.insurance?.id,
            address: {
                street: patientData.address?.street ?? '',
                city: patientData.address?.city ?? '',
                state: patientData.address?.state ?? '',
                postalCode: patientData.address?.postalCode ?? '',
                country: patientData.address?.country ?? '',
            },
            sex: patientData.sex ?? ESex.MALE,
            birthDate: patientData.birthDate ?? '',
            emergencyContact: {
                fullName: patientData.emergencyContact?.fullName ?? '',
                countryCode: patientData.emergencyContact?.countryCode ?? '+1',
                phone: patientData.emergencyContact?.phone ?? '',
            },
        });
    }, [patientData]);

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardContent className="space-y-6 my-2.5">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="relative w-24 h-24 mx-auto">
                            <Avatar className="w-24 h-24">
                                <AvatarImage
                                    src={'patient.image'}
                                    className={
                                        isEditing ? 'filter blur-sm' : ''
                                    }
                                />
                                <AvatarFallback>
                                    {!isEditing ? 'User Img' : ''}
                                </AvatarFallback>
                            </Avatar>
                            {isEditing && (
                                <>
                                    <label
                                        htmlFor="image-upload"
                                        className="cursor-pointer absolute inset-0 flex items-center justify-center bg-[rgb(0,0,0,0.4)]  bg-opacity-50 rounded-full"
                                    >
                                        <Camera className="w-6 h-6 text-white " />
                                    </label>
                                    <input
                                        id="image-upload"
                                        type="file"
                                        accept="image/*"
                                        className="sr-only"
                                        {...form.register('image')}
                                    />
                                </>
                            )}
                        </div>
                        <div className="grid gap-5">
                            <div className="flex flex-col">
                                <FormField
                                    control={form.control}
                                    name="fullName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Full Name</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    type="text"
                                                    readOnly={true}
                                                    disabled={true}
                                                    className="border-gray-400"
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="flex flex-col">
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    type="text"
                                                    readOnly={true}
                                                    disabled={true}
                                                    className="border-gray-400"
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="flex flex-row items-start justify-start">
                                <FormField
                                    control={form.control}
                                    name="countryCode"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Phone</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    type="text"
                                                    value={field.value}
                                                    disabled={true}
                                                    readOnly={true}
                                                    className="w-12 mr-2 border-gray-400"
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="phone"
                                    render={({ field }) => {
                                        return (
                                            <FormItem className="w-full sm:w-39">
                                                <FormLabel>&nbsp;</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        type="text"
                                                        placeholder="(786) 555-1234"
                                                        value={field.value}
                                                        readOnly={!isEditing}
                                                        disabled={!isEditing}
                                                        className="border-gray-400 w-full  sm:w-39"
                                                        onChange={(e) => {
                                                            const formattedNumber =
                                                                formatPhoneNumber(
                                                                    e.target
                                                                        .value
                                                                );
                                                            return field.onChange(
                                                                formattedNumber
                                                            );
                                                        }}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        );
                                    }}
                                />
                            </div>
                            <div className="flex flex-row items-start justify-between">
                                <FormField
                                    control={form.control}
                                    name="sex"
                                    render={({ field }) => (
                                        <FormItem>
                                            <Label>Sex</Label>
                                            <FormControl>
                                                <RadioGroup
                                                    onValueChange={
                                                        field.onChange
                                                    }
                                                    defaultValue={field.value}
                                                    className="flex flex-row h-[35px]"
                                                >
                                                    <FormItem className="flex items-center gap-3">
                                                        <FormControl>
                                                            <RadioGroupItem
                                                                value={
                                                                    ESex.MALE
                                                                }
                                                                className="border-gray-400"
                                                                disabled={
                                                                    !isEditing
                                                                }
                                                            />
                                                        </FormControl>
                                                        <FormLabel className="font-normal">
                                                            Male
                                                        </FormLabel>
                                                    </FormItem>
                                                    <FormItem className="flex items-center gap-3">
                                                        <FormControl>
                                                            <RadioGroupItem
                                                                value={
                                                                    ESex.FEMALE
                                                                }
                                                                className="border-gray-400"
                                                                disabled={
                                                                    !isEditing
                                                                }
                                                            />
                                                        </FormControl>
                                                        <FormLabel className="font-normal">
                                                            Female
                                                        </FormLabel>
                                                    </FormItem>
                                                </RadioGroup>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="birthDate"
                                    render={({ field }) => (
                                        <FormItem>
                                            <Label className="text-black">
                                                Birth Date
                                            </Label>
                                            <FormControl>
                                                <PickerDate
                                                    selectedDate={
                                                        field.value
                                                            ? parse(
                                                                  field.value,
                                                                  'yyyy-MM-dd',
                                                                  new Date()
                                                              )
                                                            : undefined
                                                    }
                                                    onSelectDate={(date) => {
                                                        field.onChange(
                                                            date
                                                                ? format(
                                                                      date,
                                                                      'yyyy-MM-dd'
                                                                  )
                                                                : ''
                                                        );
                                                    }}
                                                    buttonClassName="w-full sm:w-[200px]"
                                                    error={
                                                        form.formState.errors
                                                            .birthDate?.message
                                                    }
                                                    disabled={!isEditing}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="flex flex-col">
                                <FormField
                                    control={form.control}
                                    name="insuranceId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <Label className="font-normal">
                                                Insurance
                                            </Label>
                                            <FormControl>
                                                <Select
                                                    disabled={!isEditing}
                                                    value={
                                                        field.value
                                                            ? String(
                                                                  field.value
                                                              )
                                                            : ''
                                                    }
                                                    onValueChange={(val) =>
                                                        field.onChange(
                                                            Number(val)
                                                        )
                                                    }
                                                >
                                                    <SelectTrigger
                                                        className={cn(
                                                            'w-full border-gray-400 cursor-pointer',
                                                            form.formState
                                                                .errors
                                                                .insuranceId
                                                                ?.message &&
                                                                'border-destructive focus-visible:ring-destructive'
                                                        )}
                                                    >
                                                        <SelectValue placeholder="Select insurance" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {!Array.isArray(
                                                            insurancesData
                                                        ) ? (
                                                            <div className="text-red-500">
                                                                Failed to load
                                                                insurances.
                                                            </div>
                                                        ) : (
                                                            insurancesData.map(
                                                                (insurance: {
                                                                    id: number;
                                                                    name: string;
                                                                }) => (
                                                                    <SelectItem
                                                                        key={
                                                                            insurance.id
                                                                        }
                                                                        value={String(
                                                                            insurance.id
                                                                        )}
                                                                        className="cursor-pointer"
                                                                    >
                                                                        {
                                                                            insurance.name
                                                                        }
                                                                    </SelectItem>
                                                                )
                                                            )
                                                        )}
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="flex flex-row items-center justify-center gap-4">
                                <Separator className="!w-20 sm:!w-32" />
                                <span className="text-gray-400">ADDRESS</span>
                                <Separator className="!w-20 sm:!w-32" />
                            </div>
                            <div className="flex flex-col">
                                <FormField
                                    control={form.control}
                                    name="address.street"
                                    render={({ field }) => (
                                        <FormItem>
                                            <Label className="font-normal">
                                                Street
                                            </Label>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    type="text"
                                                    placeholder="123 Main St"
                                                    readOnly={!isEditing}
                                                    disabled={!isEditing}
                                                    className="border-gray-400"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="flex flex-row gap-4 items-start justify-start">
                                <FormField
                                    control={form.control}
                                    name="address.city"
                                    render={({ field }) => (
                                        <FormItem className="w-full">
                                            <Label className="font-normal">
                                                City
                                            </Label>
                                            <FormControl>
                                                <Select
                                                    disabled={!isEditing}
                                                    value={field.value}
                                                    onValueChange={
                                                        field.onChange
                                                    }
                                                >
                                                    <SelectTrigger
                                                        className={cn(
                                                            'w-full border-gray-400 cursor-pointer',
                                                            form.formState
                                                                .errors.address
                                                                ?.city
                                                                ?.message &&
                                                                'border-destructive focus-visible:ring-destructive'
                                                        )}
                                                    >
                                                        <SelectValue placeholder="Select city" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {US_CITIES.map(
                                                            (city) => (
                                                                <SelectItem
                                                                    key={city}
                                                                    value={city}
                                                                    className="cursor-pointer"
                                                                >
                                                                    {city}
                                                                </SelectItem>
                                                            )
                                                        )}
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="address.state"
                                    render={({ field }) => (
                                        <FormItem className="w-full">
                                            <Label className="font-normal">
                                                State
                                            </Label>
                                            <FormControl>
                                                <Select
                                                    disabled={!isEditing}
                                                    value={field.value}
                                                    onValueChange={
                                                        field.onChange
                                                    }
                                                >
                                                    <SelectTrigger
                                                        className={cn(
                                                            'w-full border-gray-400 cursor-pointer',
                                                            form.formState
                                                                .errors.address
                                                                ?.state
                                                                ?.message &&
                                                                'border-destructive focus-visible:ring-destructive'
                                                        )}
                                                    >
                                                        <SelectValue placeholder="Select state" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {US_STATES.map(
                                                            (state) => (
                                                                <SelectItem
                                                                    key={
                                                                        state.value
                                                                    }
                                                                    value={
                                                                        state.value
                                                                    }
                                                                    className="cursor-pointer"
                                                                >
                                                                    {
                                                                        state.label
                                                                    }
                                                                </SelectItem>
                                                            )
                                                        )}
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="flex flex-row gap-4 items-start justify-start">
                                <FormField
                                    control={form.control}
                                    name="address.postalCode"
                                    render={({ field }) => (
                                        <FormItem className="w-full">
                                            <Label className="font-normal">
                                                Postal Code
                                            </Label>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    type="text"
                                                    placeholder="90210"
                                                    readOnly={!isEditing}
                                                    disabled={!isEditing}
                                                    className="border-gray-400 w-full"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="address.country"
                                    render={({ field }) => (
                                        <FormItem className="w-full">
                                            <FormLabel className="font-normal">
                                                Country
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    type="text"
                                                    placeholder="USA"
                                                    readOnly={true}
                                                    disabled={true}
                                                    className="border-gray-400 w-full"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="flex flex-row items-center justify-center gap-4">
                                <Separator className="!w-10 sm:!w-20" />
                                <span className="text-gray-400">
                                    EMERGENCY CONTACT
                                </span>
                                <Separator className="!w-10 sm:!w-20" />
                            </div>
                            <div className="flex flex-wrap flex-row gap-4 items-start justify-start">
                                <FormField
                                    control={form.control}
                                    name="emergencyContact.fullName"
                                    render={({ field }) => (
                                        <FormItem className="w-full sm:w-42">
                                            <Label className="font-normal">
                                                Full Name
                                            </Label>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    type="text"
                                                    placeholder="Jane Doe"
                                                    readOnly={!isEditing}
                                                    disabled={!isEditing}
                                                    className="border-gray-400 w-full sm:w-42"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div className="flex flex-row items-start justify-start w-full sm:w-auto">
                                    <FormField
                                        control={form.control}
                                        name="emergencyContact.countryCode"
                                        render={({ field }) => (
                                            <FormItem>
                                                <Label className="font-normal">
                                                    Phone
                                                </Label>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        type="text"
                                                        placeholder="+1"
                                                        readOnly={true}
                                                        disabled={true}
                                                        className="w-12 mr-2 border-gray-400"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="emergencyContact.phone"
                                        render={({ field }) => (
                                            <FormItem className="w-full sm:w-39">
                                                <FormLabel className="font-normal">
                                                    &nbsp;
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        type="text"
                                                        placeholder="(305) 123-4567"
                                                        value={field.value}
                                                        readOnly={!isEditing}
                                                        disabled={!isEditing}
                                                        className="border-gray-400 w-full sm:w-39"
                                                        onChange={(e) => {
                                                            const formattedNumber =
                                                                formatPhoneNumber(
                                                                    e.target
                                                                        .value
                                                                );
                                                            return field.onChange(
                                                                formattedNumber
                                                            );
                                                        }}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-between space-x-2 mt-5">
                            <Button
                                type="button"
                                onClick={handleEdit}
                                className="cursor-pointer"
                            >
                                {!isEditing ? 'Edit' : 'Cancel'}
                            </Button>
                            <Button
                                type="submit"
                                disabled={!isEditing}
                                className="cursor-pointer"
                            >
                                Save
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
};

export default Profile;
