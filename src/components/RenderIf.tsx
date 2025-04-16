import { ReactNode } from 'react';

const RenderIf = ({
    ifTrue,
    ifChild,
    elseChild,
}: {
    ifTrue: boolean;
    ifChild: ReactNode;
    elseChild: ReactNode;
}) => {
    return <>{ifTrue ? ifChild : elseChild}</>;
};

export default RenderIf;
