import { UseMutateFunction } from '@tanstack/react-query';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';

interface ConfirmDialogProps {
    isPaid: boolean;
    open: boolean;
    paymentIntentId?: string | null;
    appointmentId: number;
    onOpenChange: (open: boolean) => void;
    cancelAppointment: UseMutateFunction<any, Error, number, unknown>;
    refundPayment: UseMutateFunction<
        any,
        Error,
        { appointmentId: number; paymentIntentId: string },
        unknown
    >;
}

const ConfirmDialog = (props: ConfirmDialogProps) => {
    const {
        open,
        onOpenChange,
        isPaid,
        cancelAppointment,
        paymentIntentId,
        appointmentId,
    } = props;

    const text = isPaid
        ? 'This appointment has been paid for. Are you sure you want to cancel it? Refunds would take 5–10 days to appear in your account.'
        : 'Are you sure you want to proceed with this action?';

    const handleOnClick = () => {
        cancelAppointment(appointmentId);
        if (isPaid && paymentIntentId) {
            props.refundPayment({
                appointmentId,
                paymentIntentId,
            });
        }
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-white sm:max-w-[350px]">
                <DialogHeader>
                    <DialogTitle>Confirm Action</DialogTitle>
                    <DialogDescription>{text}</DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button className="cursor-pointer" variant="outline">
                            Cancel
                        </Button>
                    </DialogClose>
                    <Button className="cursor-pointer" onClick={handleOnClick}>
                        Confirm
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ConfirmDialog;
