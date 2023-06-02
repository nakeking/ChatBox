import { FC } from "react";
import { SuiLabel } from "../../../components";

import { Input } from "antd";
import { useTranslation } from "react-i18next";
const { TextArea } = Input;

const Prompt: FC = () => {
    const { t } = useTranslation()

    return (
        <div className="prompt">
            <div className="promptForm">
                <SuiLabel placeholder="Prompt">
                    <TextArea className="webkitScrollbarBase" bordered={false} autoSize={{ maxRows: 5 }}/>
                </SuiLabel>
                <button type="button">{t("common.Send")}</button>
            </div>
            <div className="tip">
                {t("Prompt.Tip")}
            </div>
        </div>
    )
}

export default Prompt