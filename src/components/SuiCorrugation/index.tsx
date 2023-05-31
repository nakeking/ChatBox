import React, { FC, ReactNode, useRef, useState } from "react";

interface SuiCorrugationProps {
    children?: ReactNode
}

const SuiCorrugation: FC<SuiCorrugationProps> = (props) => {
    const { children } = props;
    const [ animationStatus, changeAnimationStatus] = useState(false)
    const [clent, setClient] = useState({x: 0, y: 0})

    const corrugation = useRef<HTMLDivElement>(null)
    
    const createCorrugation = (env: React.MouseEvent) => {
        if(animationStatus) {
            return false
        }

        let pos = corrugation.current!.getBoundingClientRect()
        
        let x = env.clientX - pos.x
        let y = env.clientY - pos.y

        changeAnimationStatus(true)
        setClient({x, y})
        
        const timer = setTimeout(() => {
            changeAnimationStatus(false);

            clearTimeout(timer)
        }, 400)
    }

    return (
        <div 
            ref={corrugation}
            className="SuiCorrugation" 
            onClick={createCorrugation}>
            {children}
            <div className="ripple-root">
                { animationStatus ? 
                    <span style={{
                        left: `${clent.x}px`,
                        top: `${clent.y}px`
                    }} className="ripple"></span> 
                    : null
                }
            </div>
        </div>
    )
}

export default SuiCorrugation