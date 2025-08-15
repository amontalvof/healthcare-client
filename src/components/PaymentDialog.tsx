import { useEffect, useRef } from 'react';
import { loadStripe, StripeEmbeddedCheckout } from '@stripe/stripe-js';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { fetchWithToken } from '@/helpers';
import { useQuery } from '@tanstack/react-query';
import { IOriginal } from '@/types/Appointment';

type PaymentDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    original: IOriginal;
};

type CreateSessionResp = { client_secret: string };

const PaymentDialog = (props: PaymentDialogProps) => {
    const { open, onOpenChange, original } = props;

    const { data, isLoading, error } = useQuery<CreateSessionResp>({
        queryKey: ['checkoutSession', original?.appointmentId],
        queryFn: async (): Promise<CreateSessionResp> =>
            fetchWithToken(
                '/billing/create-payment-session',
                { currency: 'usd', items: [original] },
                'POST'
            ),
        refetchOnWindowFocus: false,
        staleTime: Infinity,
        retry: false,
        enabled: open,
    });

    const clientSecret = data?.client_secret;

    // Keep a single Embedded Checkout instance around while the dialog is open
    const checkoutRef = useRef<StripeEmbeddedCheckout | null>(null);

    useEffect(() => {
        if (!open || !clientSecret) return;

        let cancelled = false;

        (async () => {
            // Safety: if we somehow had an old instance, clean it first
            if (checkoutRef.current) {
                try {
                    checkoutRef.current.destroy();
                } catch {}
                checkoutRef.current = null;
            }

            const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PK!);
            if (!stripe || cancelled) return;

            const checkout = await stripe.initEmbeddedCheckout({
                clientSecret,
            });
            checkoutRef.current = checkout;
            checkout.mount('#checkout'); // attach to the div
        })();

        // Cleanup when closing the dialog or unmounting the component
        return () => {
            cancelled = true;
            if (checkoutRef.current) {
                try {
                    checkoutRef.current.destroy();
                } catch {}
                checkoutRef.current = null;
            }
        };
    }, [open, clientSecret]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="!max-w-[350px] sm:!max-w-[500px] !min-h-[300px] max-h-[90vh] bg-white px-2 pb-2 sm:pb-5 pt-5">
                <DialogHeader>
                    <DialogTitle />
                    <DialogDescription>
                        {isLoading && (
                            <span className="pl-5">Loading checkout...</span>
                        )}
                        {error && (
                            <span className="pl-5">
                                Failed to create checkout session.
                            </span>
                        )}
                    </DialogDescription>
                </DialogHeader>
                {!isLoading && !error && (
                    <div
                        id="checkout"
                        className="!min-h-[350px] w-full max-h-[80vh] overflow-y-auto"
                    />
                )}
            </DialogContent>
        </Dialog>
    );
};

export default PaymentDialog;
