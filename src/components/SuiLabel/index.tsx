import React, { FC, ReactElement, JSXElementConstructor, useEffect, useState } from "react";
import classNames from 'classnames'

type SuiLabelProp = {
    children: ReactElement<any, string | JSXElementConstructor<any>>,

    placeholder: string,
} & React.HTMLAttributes<HTMLDivElement>

const SuiLabel: FC<SuiLabelProp> = (prop) => {
    const { children, placeholder, ...otherProp } = prop
    const childrenValue = children?.props.value

    const [ status, ToggleStatus ] = useState(childrenValue ? true : false)

    const boxTitleClassNames = classNames('label', {
        'expand': !status,
        'fold': status
    })

    const handleFocus = () => {
        ToggleStatus(true)
    }

    const handleBlur = () => {
        if(!children?.props.value) {
            ToggleStatus(false)
        }
    }

    return (
        <div className="SuiLabel" {...otherProp} >
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