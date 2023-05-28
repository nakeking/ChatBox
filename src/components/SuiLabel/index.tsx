import { FC, ReactNode, useEffect, useRef, useState } from "react";
import classNames from 'classnames'

type SuiLabelProp = {
    children: ReactNode,

    placeholder: string
}
const SuiLabel: FC<SuiLabelProp> = (prop) => {
    const { children, placeholder } = prop

    const [ status, ToggleStatus ] = useState(false)

    const boxTitleClassNames = classNames('label', {
        'expand': !status,
        'fold': status
    })

    const handleFocus = () => {
        ToggleStatus(true)
    }

    const handleBlur = () => {
        ToggleStatus(false)
    }

    return (
        <div className="SuiLabel">
            <label className={boxTitleClassNames}>{placeholder}</label>
            <div 
                className="childrenBox" 
                tabIndex={-1}
                onFocus={handleFocus}
                onBlur={handleBlur}>
                {children}
            </div>
        </div>
    )
}

SuiLabel.defaultProps = {
    placeholder: "Placeholder"
};

export default SuiLabel