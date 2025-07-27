import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';

interface ConditionalTooltipProps {
    children: React.ReactNode;
    content: React.ReactNode;
    className?: string;
    enabled: boolean;
}

export const ConditionalTooltip = ({
    children,
    content,
    enabled,
    className,
}: ConditionalTooltipProps) => {
    if (!enabled) {
        return <>{children}</>;
    }
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <div className={className}>{children}</div>
            </TooltipTrigger>
            <TooltipContent>{content}</TooltipContent>
        </Tooltip>
    );
};
