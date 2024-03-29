import { FC, useContext, useEffect, useState } from 'react'

import { BulbOutlined, BulbFilled, WarningOutlined } from '@ant-design/icons'
import { Modal, Radio, Button, Input, Select, Form, Collapse } from 'antd'

import useThemeHook, { themeType } from '../../hooks/useThemeHook'
import { SuiLabel } from '../../components'
import ChatBoxContext from '../../context'
import { useTranslation } from 'react-i18next'

// ====== SettingsPanel ======================================
interface SettingsPanelProp {
  open: boolean
  cancelSetUp: Function
}
const SettingsPanel: FC<SettingsPanelProp> = (prop) => {
  const { t } = useTranslation()
  let { open, cancelSetUp } = prop
  const { state, _saveSettings } = useContext(ChatBoxContext)
  const { Settings } = state

  // =============== Form ============================
  let [initialValues] = useState({
    OpenAIKey: Settings.OpenAIKey,
    language: Settings.language,
    model: Settings.model
  })
  const [form] = Form.useForm()

  const handleCancel = () => {
    form.setFieldsValue({
      OpenAIKey: Settings.OpenAIKey,
      language: Settings.language
    })

    cancelSetUp()
  }

  const onFinish = (values: any) => {
    let { Settings } = state
    _saveSettings({ ...Settings, ...values })

    cancelSetUp()
  }

  // =============== 设置主题 ===============================
  const [theme, setTheme] = useState<themeType>()
  const { handleToggleTheme } = useThemeHook()

  // 获取缓存主题设置，默认"light"
  useEffect(() => {
    const { theme } = Settings
    setTheme(theme)
  }, [])

  const handleThemeChange = (theme: themeType) => {
    setTheme(theme)

    handleToggleTheme(theme)
  }

  return (
    <Modal
      className="setUpModal"
      centered
      open={open}
      title={t('SettingsPanel.Settings')}
      closable={false}
      getContainer={false}
      footer={[
        <Button type="text" key="back" onClick={handleCancel}>
          {t('common.Cancel')}
        </Button>,
        <Button type="text" key="submit" onClick={form.submit}>
          {t('common.Save')}
        </Button>
      ]}
    >
      <div className="modal_body webkitScrollbarBase">
        <Form
          name="basic"
          form={form}
          initialValues={initialValues}
          onFinish={onFinish}
        >
          <Form.Item style={{ marginTop: 20 }} name="OpenAIKey">
            <OpenAIKeyInput />
          </Form.Item>

          <Form.Item name="language">
            <LanguageSelect />
          </Form.Item>

          <div className="formItem">
            <span className="title">{t('SettingsPanel.theme')}</span>
            <Radio.Group
              value={theme}
              buttonStyle="solid"
              onChange={(e) => handleThemeChange(e.target.value)}
            >
              <Radio.Button value="light">
                <BulbOutlined />
              </Radio.Button>
              <Radio.Button value="dark">
                <BulbFilled />
              </Radio.Button>
            </Radio.Group>
          </div>

          <Collapse>
            <Collapse.Panel
              header={`${t('SettingsPanel.model')} & ${t(
                'SettingsPanel.token'
              )}`}
              key={1}
            >
              <div className="warning">
                <WarningOutlined />
                <p>{t('SettingsPanel.waringMsg')}</p>
              </div>
              <div className="formItem">
                <Form.Item name="model">
                  <ModelSelect />
                </Form.Item>
              </div>
            </Collapse.Panel>
          </Collapse>
        </Form>
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
  const { t } = useTranslation()
  const [OpenAIKey, setOpenAIKey] = useState(value)

  const triggerChange = (OpenAIKey: string) => {
    onChange?.(OpenAIKey)
  }

  const openAIKeyChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const newKey = evt.target.value || ''
    setOpenAIKey(newKey)

    triggerChange(newKey)
  }

  return (
    <SuiLabel placeholder={t('SettingsPanel.OpenAIKey')}>
      <Input
        type="password"
        value={value || OpenAIKey}
        onChange={openAIKeyChange}
        bordered={false}
      />
    </SuiLabel>
  )
}

// ====== LanguageSelect ====================================
interface LanguageSelectProps {
  value?: string
  onChange?: (value: string) => void
}
const LanguageSelect: FC<LanguageSelectProps> = ({ value, onChange }) => {
  const { t } = useTranslation()
  const [language, setLanguage] = useState(value)

  const triggerChange = (language: string) => {
    onChange?.(language)
  }

  const handleChange = (value: string) => {
    setLanguage(value)
    triggerChange(value)
  }

  return (
    <SuiLabel placeholder={t('SettingsPanel.language')}>
      <Select
        style={{ width: '100%' }}
        bordered={false}
        value={value || language}
        options={[
          { value: 'en', label: 'English' },
          { value: 'zh-cn', label: '简体中文' }
        ]}
        onChange={handleChange}
      />
    </SuiLabel>
  )
}

// ======= ModelSelect ============================================
interface ModelSelectProps {
  value?: string
  onChange?: (value: string) => void
}
const ModelSelect: FC<ModelSelectProps> = ({ value, onChange }) => {
  const { t } = useTranslation()
  const [model, setModel] = useState(value)

  const triggerChange = (language: string) => {
    onChange?.(language)
  }

  const handleChange = (value: string) => {
    setModel(value)
    triggerChange(value)
  }

  return (
    <SuiLabel placeholder={t('SettingsPanel.model')}>
      <Select
        style={{ width: '100%' }}
        bordered={false}
        value={value || model}
        options={[
          { value: 'gpt-3.5-turbo', label: 'gpt-3.5-turbo' },
          { value: 'gpt-4', label: 'gpt-4' },
          { value: 'gpt-4-32k', label: 'gpt-4-32k' }
        ]}
        onChange={handleChange}
      />
    </SuiLabel>
  )
}

export default SettingsPanel
