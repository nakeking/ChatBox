import React, {
  ChangeEvent,
  FC,
  MouseEventHandler,
  memo,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react'

import {
  MessageOutlined,
  MoreOutlined,
  EditFilled,
  DeleteFilled
} from '@ant-design/icons'
import { SuiCorrugation, SuiLabel } from '../../components'
import { useTranslation } from 'react-i18next'
import { Modal, Popover, Button, Input } from 'antd'
import ChatBoxContext from '../../context'

import type { DialogueType } from '../../types'
import classNames from 'classnames'

const Dialogues: FC = () => {
  const { t } = useTranslation()

  const [popupContainer, setPopupContainer] = useState<HTMLElement>()
  useEffect(() => {
    setPopupContainer(document.getElementById('dialogues') as HTMLElement)
  }, [popupContainer])

  const { state, _delDialogue, _renameDialogue, _toggleDialogue } =
    useContext(ChatBoxContext)
  const Dialogues = [...state.Dialogues!.values()].reverse()

  const handleDelete = (id: string) => {
    _delDialogue(id)
  }
  const handleRename = (dialogue: DialogueType) => {
    _renameDialogue(dialogue)
  }
  const handleToggle = async (dialogue: DialogueType) => {
    _toggleDialogue(dialogue)
  }

  return (
    <div id="dialogues" className="dialogues">
      <div className="title">{t('Dialogues.dialogues')}</div>

      <div className="dialogue webkitScrollbarBase">
        {Dialogues.map((dialogue) => {
          return (
            <DialogueItem
              key={dialogue.id}
              dialogue={dialogue}
              popupContainer={popupContainer as HTMLElement}
              handleDelete={handleDelete}
              handleRename={handleRename}
              handleToggle={handleToggle}
            />
          )
        })}
      </div>
    </div>
  )
}

interface DialogueItemProps {
  dialogue: DialogueType
  popupContainer: HTMLElement

  handleDelete: Function
  handleRename: Function
  handleToggle: Function
}

const DialogueItem: FC<DialogueItemProps> = (props) => {
  const {
    dialogue,
    popupContainer,

    handleDelete,
    handleRename,
    handleToggle
  } = props
  const { t } = useTranslation()

  const [popoverOpen, setPopoverOpen] = useState(false)
  const popoverOpenChange = (status: boolean) => {
    setPopoverOpen(status)
  }

  const [open, setOpen] = useState(false)
  const modalOpenChange = (evt: React.MouseEvent) => {
    evt.stopPropagation()

    setOpen(true)
    setPopoverOpen(false)
  }

  const [name, setName] = useState(dialogue.name)
  const handleChange = (evt: ChangeEvent<HTMLInputElement>) => {
    setName(evt.target.value)
  }

  const cancelRename = () => {
    setName(dialogue.name)
    setOpen(false)
  }

  const saveRename = () => {
    handleRename({ ...dialogue, name })
    setOpen(false)
  }

  const { state } = useContext(ChatBoxContext)
  const itemClass = classNames('dialogueItem', {
    activation: state.currentDialogue?.id === dialogue.id
  })

  return (
    <SuiCorrugation>
      <div
        className={itemClass}
        onClick={() => {
          handleToggle(dialogue)
        }}
      >
        <MessageOutlined />
        <div className="title">{dialogue.name}</div>
        <div
          className="more iconBase"
          onClick={(evt) => {
            evt.stopPropagation()
          }}
        >
          <Popover
            open={popoverOpen}
            onOpenChange={popoverOpenChange}
            overlayClassName="dialoguePop"
            placement="bottomRight"
            arrow={false}
            getPopupContainer={() => {
              return popupContainer
            }}
            content={
              <div className="popContent">
                <div className="popItem" onClick={modalOpenChange}>
                  <EditFilled />
                  {t('Dialogues.rename')}
                </div>
                <span className="hr"></span>
                <div
                  className="popItem"
                  onClick={() => {
                    handleDelete(dialogue.id)
                  }}
                >
                  <DeleteFilled />
                  {t('Dialogues.delete')}
                </div>
              </div>
            }
            title={false}
            trigger="click"
          >
            <MoreOutlined />
          </Popover>

          <Modal
            open={open}
            title={t('Dialogues.rename')}
            closable={false}
            width={320}
            bodyStyle={{ paddingTop: '10px' }}
            destroyOnClose={true}
            footer={[
              <Button type="text" key="back" onClick={cancelRename}>
                {t('common.Cancel')}
              </Button>,
              <Button type="text" key="submit" onClick={saveRename}>
                {t('common.Save')}
              </Button>
            ]}
          >
            <div className="modal_body">
              <SuiLabel placeholder={t('Dialogues.name')}>
                <Input
                  type="text"
                  spellCheck={false}
                  value={name}
                  onChange={handleChange}
                  bordered={false}
                />
              </SuiLabel>
            </div>
          </Modal>
        </div>
      </div>
    </SuiCorrugation>
  )
}

export default memo(Dialogues)
