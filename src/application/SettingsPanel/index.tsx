import { FC, useContext, useEffect, useState } from "react";

import {
    BulbOutlined,
    BulbFilled
} from '@ant-design/icons'
import { Modal, Radio, Button, Input, Select, Form } from 'antd'
import useThemeHook, { themeType } from "../../hooks/useThemeHook";
import { getStore } from "../../utils";
import { SuiLabel } from "../../components";
import { useReducerContext } from "../../context";

// ====== SettingsPanel ======================================
interface SettingsPanelProp {
    open: boolean,
    cancelSetUp: Function
}
const SettingsPanel: FC<SettingsPanelProp> = (prop) => {
    let { open, cancelSetUp } = prop;

    // =============== Save Form ============================
    const { state, _setOpenAIKey, _setLanguage } = useReducerContext()
    const [ form ] = Form.useForm()

    const onFinish = (values: any) => {
        let { OpenAIKey: SOpenAIKey, language: SLanguage } = state
        let { openAIKey, language } = values

        if(SOpenAIKey !== openAIKey) {
            _setOpenAIKey(openAIKey)
        }

        if(SLanguage !== language) {
            _setLanguage(language)
        }

        cancelSetUp()
    };

    // =============== 设置主题 ===============================
    const [theme, setTheme] = useState<themeType>()
    const { handleToggleTheme } = useThemeHook()

    // 获取缓存主题设置，默认"light"
    useEffect(() => {
        const storedTheme = getStore('theme')

        setTheme(storedTheme?.themeType || 'light')
    }, [])

    const handleThemeChange = (theme: themeType) => {
        setTheme(theme)

        handleToggleTheme(theme)
    }
    
    return (
        <Modal
            className='setUpModal'
            open={open}
            title="设置"
            closable={false}
            getContainer={false}
            footer={[
                <Button type="text" key="back" onClick={ () => cancelSetUp()}>
                    取消
                </Button>,
                <Button type="text" key="submit" onClick={form.submit}>
                    保存
                </Button>
            ]}>
                <div className='modal_body'>
                    <Form 
                        name="basic" 
                        form={form} 
                        initialValues={{
                            openAIKey: state.OpenAIKey,
                            language: state.language?.locale
                        }}
                        onFinish={onFinish}>
                        <Form.Item style={{marginTop: 20}} name="openAIKey">
                            <OpenAIKeyInput />
                        </Form.Item>
                        
                        <Form.Item name="language">
                            <LanguageSelect />
                        </Form.Item>
                    </Form>
                    
                    <div className="formItem">
                        <span className='title'>主题</span>
                        <Radio.Group value={theme} buttonStyle="solid" onChange={(e) => handleThemeChange(e.target.value)}>
                            <Radio.Button value="light">
                                <BulbOutlined />
                            </Radio.Button>
                            <Radio.Button value="dark">
                                <BulbFilled />
                            </Radio.Button>
                        </Radio.Group>
                    </div>
                </div>
        </Modal>
    )
}

// ====== OpenAIKey =========================================
interface OpenAIKeyProps {
    value?: string
    onChange?: (value: string) => void
}
const OpenAIKeyInput: React.FC<OpenAIKeyProps> = ({ value, onChange }) => {
    const [ OpenAIKey, setOpenAIKey] = useState(value);

    const triggerChange = (OpenAIKey: string ) => {
        onChange?.(OpenAIKey);
    };

    const openAIKeyChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
        const newKey = evt.target.value || ''
        setOpenAIKey(newKey);

        triggerChange(newKey);
    }
    
    return (
        <SuiLabel placeholder="OpenAI API密钥">
            <Input type="password" value={OpenAIKey} onChange={openAIKeyChange} bordered={false} />
        </SuiLabel>
    )
}

// ====== LanguageSelect ====================================
interface LanguageSelectProps {
    value?: string
    onChange?: (value: string) => void
}
const LanguageSelect: FC<LanguageSelectProps> = ({value, onChange}) => {
    const [ language, setLanguage ] = useState(value)

    const triggerChange = (language: string ) => {
        onChange?.(language);
    };
    
    const handleChange = (value: string) => {
        setLanguage(value)
        triggerChange(value)
    }

    return (
        <SuiLabel placeholder="语言" >
            <Select 
                style={{width: '100%'}} 
                bordered={false} 
                value={language}
                options={[
                    {value: "en", label: "English"},
                    {value: "zh-cn", label: "简体中文"}
                ]}
                onChange={ handleChange }/>
        </SuiLabel>
    )
}

export default SettingsPanel