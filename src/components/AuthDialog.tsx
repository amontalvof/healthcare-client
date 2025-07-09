import { useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z, ZodTypeAny } from 'zod';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from '@/components/ui/input-otp';
import { REGEXP_ONLY_DIGITS } from 'input-otp';
import { Input } from '@/components/ui/input';
import { AuthTypes } from '@/constants';
import {
    resolveAuthDialogContent,
    resolveAuthDialogInfo,
    resolveAuthDialogSchemas,
} from '@/helpers';
import { TContentName } from '@/types/AuthDialog';
import RenderIf from './RenderIf';
import { authQueries } from '@/api/auth';
import { useAuthCredentials, useAuthDialog } from '@/context/auth';

const AuthDialog = () => {
    const { isAuthDialogOpen, setAuthDialogOpen } = useAuthDialog(
        (state) => state
    );
    const setCredentials = useAuthCredentials((state) => state.setCredentials);
    const [type, setType] = useState<Exclude<AuthTypes, 'resend-code'>>(
        AuthTypes.LOGIN
    );
    const [showPassword, setShowPassword] = useState(false);
    const [emailToVerify, setEmailToVerify] = useState('');
    const { dialogTitle, dialogDescription, dialogButtonText, defaultValues } =
        resolveAuthDialogInfo(type);

    const mutation = useMutation({
        mutationFn: async ({
            clickedType,
            values,
        }: {
            clickedType: AuthTypes;
            values: z.infer<typeof formSchema>;
        }) => {
            return authQueries(clickedType, values);
        },
        onSuccess: (data, { clickedType }) => {
            switch (clickedType) {
                case AuthTypes.REGISTER:
                    setType(AuthTypes.VERIFY_ACCOUNT);
                    setEmailToVerify(data.email);
                    break;
                case AuthTypes.VERIFY_ACCOUNT:
                    toast.success('Account verified successfully!');
                    setType(AuthTypes.LOGIN);
                    form.reset();
                    break;
                case AuthTypes.LOGIN:
                    setCredentials(data.accessToken);
                    break;
                default:
                    break;
            }
        },
        onError: (error) => {
            toast.error(
                error instanceof Error
                    ? error.message
                    : 'An error occurred while processing your request.'
            );
        },
    });

    const formSchema = resolveAuthDialogSchemas(type);
    const formContent = resolveAuthDialogContent(type);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema as ZodTypeAny),
        defaultValues,
    });

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        if (type === AuthTypes.VERIFY_ACCOUNT && 'verificationCode' in values) {
            const newVales = {
                code: values.verificationCode,
                email: emailToVerify,
            };
            return mutation.mutate({ clickedType: type, values: newVales });
        }
        if (type === AuthTypes.LOGIN) {
            setAuthDialogOpen(false);
        }
        return mutation.mutate({ clickedType: type, values });
    };

    const handleOpenChange = (open: boolean) => {
        setAuthDialogOpen(open);
        if (!open) {
            setType(AuthTypes.LOGIN);
            form.reset();
        }
    };

    const handlePLinksClick = (newType: AuthTypes) => {
        if (newType === AuthTypes.RESEND_CODE) {
            return mutation.mutate({
                clickedType: newType,
                values: { email: emailToVerify },
            });
        }
        setType(newType);
        form.reset();
    };

    return (
        <Dialog open={isAuthDialogOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button className="cursor-pointer mr-3 sm:mr-0">Login</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-8"
                    >
                        <DialogHeader>
                            <DialogTitle>{dialogTitle}</DialogTitle>
                            <DialogDescription>
                                {dialogDescription}
                            </DialogDescription>
                        </DialogHeader>
                        {formContent.map(
                            (
                                content: {
                                    name: string;
                                    label: string;
                                    type: string;
                                    placeholder?: string;
                                },
                                index: number
                            ) => {
                                const keyIndex = `${content.name}-${index}`;
                                return (
                                    <FormField
                                        key={keyIndex}
                                        control={form.control}
                                        name={content.name as TContentName}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    {content.label}
                                                </FormLabel>
                                                <FormControl>
                                                    <RenderIf
                                                        ifTrue={
                                                            type ===
                                                            AuthTypes.VERIFY_ACCOUNT
                                                        }
                                                        ifChild={
                                                            <InputOTP
                                                                maxLength={6}
                                                                {...field}
                                                                pattern={
                                                                    REGEXP_ONLY_DIGITS
                                                                }
                                                            >
                                                                <InputOTPGroup>
                                                                    <InputOTPSlot
                                                                        index={
                                                                            0
                                                                        }
                                                                        className="w-11 h-11 sm:w-14 sm:h-14 text-xl mr-1.5 border border-gray-400 rounded-md focus:ring-2 focus:ring-primary"
                                                                    />
                                                                    <InputOTPSlot
                                                                        index={
                                                                            1
                                                                        }
                                                                        className="w-11 h-11 sm:w-14 sm:h-14 text-xl mr-1.5 border border-gray-400 rounded-md focus:ring-2 focus:ring-primary"
                                                                    />
                                                                    <InputOTPSlot
                                                                        index={
                                                                            2
                                                                        }
                                                                        className="w-11 h-11 sm:w-14 sm:h-14 text-xl mr-1.5 border border-gray-400 rounded-md focus:ring-2 focus:ring-primary"
                                                                    />
                                                                    <InputOTPSlot
                                                                        index={
                                                                            3
                                                                        }
                                                                        className="w-11 h-11 sm:w-14 sm:h-14 text-xl mr-1.5 border border-gray-400 rounded-md focus:ring-2 focus:ring-primary"
                                                                    />
                                                                    <InputOTPSlot
                                                                        index={
                                                                            4
                                                                        }
                                                                        className="w-11 h-11 sm:w-14 sm:h-14 text-xl mr-1.5 border border-gray-400 rounded-md focus:ring-2 focus:ring-primary"
                                                                    />
                                                                    <InputOTPSlot
                                                                        index={
                                                                            5
                                                                        }
                                                                        className="w-11 h-11 sm:w-14 sm:h-14 text-xl mr-1.5 border border-gray-400 rounded-md focus:ring-2 focus:ring-primary"
                                                                    />
                                                                </InputOTPGroup>
                                                            </InputOTP>
                                                        }
                                                        elseChild={
                                                            content.type ===
                                                            'password' ? (
                                                                <div className="relative">
                                                                    <Input
                                                                        {...field}
                                                                        className="pr-10 border-gray-400"
                                                                        type={
                                                                            showPassword
                                                                                ? 'text'
                                                                                : 'password'
                                                                        }
                                                                        placeholder={
                                                                            content.placeholder
                                                                        }
                                                                    />
                                                                    <button
                                                                        type="button"
                                                                        className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500"
                                                                        tabIndex={
                                                                            -1
                                                                        }
                                                                        onClick={() =>
                                                                            setShowPassword(
                                                                                (
                                                                                    prev
                                                                                ) =>
                                                                                    !prev
                                                                            )
                                                                        }
                                                                    >
                                                                        {showPassword ? (
                                                                            <EyeOff className="w-5 h-5" />
                                                                        ) : (
                                                                            <Eye className="w-5 h-5" />
                                                                        )}
                                                                    </button>
                                                                </div>
                                                            ) : (
                                                                <Input
                                                                    {...field}
                                                                    className="border-gray-400"
                                                                    type={
                                                                        content.type
                                                                    }
                                                                    placeholder={
                                                                        content.placeholder
                                                                    }
                                                                />
                                                            )
                                                        }
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                );
                            }
                        )}
                        <PLinks type={type} onClick={handlePLinksClick} />
                        <DialogFooter>
                            <Button className="cursor-pointer" type="submit">
                                {dialogButtonText}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

const PLinks = ({
    type,
    onClick,
}: {
    type: AuthTypes;
    onClick: (newType: AuthTypes) => void;
}) => {
    const [counter, setCounter] = useState(0);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (counter > 0) {
            timer = setTimeout(() => setCounter(counter - 1), 1000);
        }
        return () => clearTimeout(timer);
    }, [counter]);

    useEffect(() => {
        if (type !== AuthTypes.VERIFY_ACCOUNT) {
            setCounter(0);
        }
    }, [type]);

    const handleResend = () => {
        onClick(AuthTypes.RESEND_CODE);
        setCounter(60);
    };
    return (
        <div className="text-sm text-gray-600 space-y-2">
            {type === AuthTypes.LOGIN && (
                <>
                    <div>
                        Don't have an account?{' '}
                        <button
                            className="text-primary font-bold cursor-pointer hover:underline"
                            onClick={() => onClick(AuthTypes.REGISTER)}
                            type="button"
                        >
                            Register
                        </button>
                    </div>
                    {/* <div>
                        Forgot your password?{' '}
                        <button
                            className="text-primary font-bold cursor-pointer hover:underline"
                            onClick={() => onClick(AuthTypes.FORGOT_PASSWORD)}
                            type="button"
                        >
                            Click here
                        </button>
                    </div> */}
                </>
            )}
            {type === AuthTypes.REGISTER && (
                <div>
                    Already have an account?{' '}
                    <button
                        className="text-primary font-bold cursor-pointer hover:underline"
                        onClick={() => onClick(AuthTypes.LOGIN)}
                        type="button"
                    >
                        Login
                    </button>
                </div>
            )}
            {type === AuthTypes.FORGOT_PASSWORD && (
                <div>
                    Remembered your password?{' '}
                    <button
                        className="text-primary font-bold cursor-pointer hover:underline"
                        onClick={() => onClick(AuthTypes.LOGIN)}
                        type="button"
                    >
                        Login
                    </button>
                </div>
            )}
            {type === AuthTypes.VERIFY_ACCOUNT && (
                <div>
                    Didn't receive a code?{' '}
                    <button
                        className={`font-bold cursor-pointer hover:underline transition-colors
                            ${
                                counter > 0
                                    ? 'text-gray-400 cursor-not-allowed bg-gray-100'
                                    : 'text-primary bg-transparent'
                            }
                        `}
                        onClick={handleResend}
                        type="button"
                        disabled={counter > 0}
                    >
                        {counter > 0
                            ? `Resend code (${counter}s)`
                            : 'Resend code'}
                    </button>
                </div>
            )}
        </div>
    );
};

export default AuthDialog;
