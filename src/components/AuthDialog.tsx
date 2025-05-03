import { useState } from 'react';
import { Button } from '@/components/ui/button';
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
import { z } from 'zod';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { AuthTypes } from '@/constants';
import {
    resolveAuthDialogContent,
    resolveAuthDialogInfo,
    resolveAuthDialogSchemas,
} from '@/helpers';
import { TContentName } from '@/types/AuthDialog';

const AuthDialog = () => {
    const [type, setType] = useState(AuthTypes.LOGIN);

    const { dialogTitle, dialogDescription, dialogButtonText, defaultValues } =
        resolveAuthDialogInfo(type);

    const formSchema = resolveAuthDialogSchemas(type);
    const formContent = resolveAuthDialogContent(type);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues,
    });

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        console.log(values);
    };

    const handleOpenChange = (open: boolean) => {
        if (open) {
            return;
        }
        setType(AuthTypes.LOGIN);
        form.reset();
    };

    const handlePLinksClick = (newType: AuthTypes) => {
        setType(newType);
        form.reset();
    };

    return (
        <Dialog onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button className="cursor-pointer">Login</Button>
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
                        {formContent.map((content, index) => {
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
                                                <Input
                                                    {...field}
                                                    type={content.type}
                                                    placeholder={
                                                        content.placeholder
                                                    }
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            );
                        })}
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
    return (
        <p className="text-sm text-gray-600 space-y-2">
            {type === AuthTypes.LOGIN && (
                <div>
                    Don't have an account?{' '}
                    <button
                        className="text-primary font-bold cursor-pointer hover:underline"
                        onClick={() => onClick(AuthTypes.REGISTER)}
                    >
                        Register
                    </button>
                </div>
            )}
            {type === AuthTypes.REGISTER && (
                <div>
                    Already have an account?{' '}
                    <button
                        className="text-primary font-bold cursor-pointer hover:underline"
                        onClick={() => onClick(AuthTypes.LOGIN)}
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
                    >
                        Login
                    </button>
                </div>
            )}
            {type !== AuthTypes.FORGOT_PASSWORD && (
                <div>
                    Forgot your password?{' '}
                    <button
                        className="text-primary font-bold cursor-pointer hover:underline"
                        onClick={() => onClick(AuthTypes.FORGOT_PASSWORD)}
                    >
                        Click here
                    </button>
                </div>
            )}
        </p>
    );
};

export default AuthDialog;
