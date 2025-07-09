import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';

interface ConditionalTooltipProps {
    children: React.ReactNode;
    content: React.ReactNode;
    enabled: boolean;
}

export const ConditionalTooltip = ({
    children,
    content,
    enabled,
}: ConditionalTooltipProps) => {
    if (!enabled) {
        return <>{children}</>;
    }
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <div>{children}</div>
            </TooltipTrigger>
            <TooltipContent>{content}</TooltipContent>
        </Tooltip>
    );
};
