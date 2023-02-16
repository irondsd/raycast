import { useRef } from "react"
import { Form, ActionPanel, Action, Clipboard, closeMainWindow, showHUD, popToRoot } from "@raycast/api"
import BN from 'bn.js'

type Values = {
  actionField: string
  textField: string
  decimalsField: string
}

export default function Command() {
  const actionFieldRef = useRef<Form.Dropdown>(null)
  const textFieldRef = useRef<Form.TextField>(null)
  const decimalsFieldRef = useRef<Form.DatePicker>(null)

  function handleSubmit(values: Values) {
    const { actionField, textField, decimalsField } = values

    try {
      const number = new BN(textField)
      const decimals = parseInt(decimalsField)
      const pow = new BN(String(Math.pow(10, decimals)))

      if (actionField === 'parse') {
        try {
          const result = parseInt(textField) / Math.pow(10, parseInt(decimalsField))
          Clipboard.copy(String(parseFloat(result.toFixed(2))))
        } catch (error) {
          const result = number.div(pow)
          Clipboard.copy(result.toString())
        }
      } else {
        const result = number.mul(pow)
        Clipboard.copy(result.toString())
      }
      
      showHUD('Copied 👍')
    } catch (error) {
      showHUD('Incorrect number ❌')
    }

    closeMainWindow()
    popToRoot()
  }

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm onSubmit={handleSubmit} />
          <Action title="Reset Action" onAction={() => actionFieldRef.current?.reset()} />
          <Action title="Reset TextField" onAction={() => textFieldRef.current?.reset()} />
          <Action title="Reset Decimals" onAction={() => decimalsFieldRef.current?.reset()} />
        </ActionPanel>
      }
    >
      <Form.Description text="Paste number down below" />
      <Form.Dropdown id="actionField" title="Format type" ref={actionFieldRef} defaultValue='parse'>
        <Form.Dropdown.Item value="parse" title="Parse" />
        <Form.Dropdown.Item value="format" title="Format" />
      </Form.Dropdown>
      <Form.TextField id="textField" title="Number" placeholder="Paste number here" ref={textFieldRef} autoFocus />
      <Form.TextField id="decimalsField" title="Decimals" placeholder="Decimals" ref={textFieldRef} defaultValue={'18'} />
    </Form>
  )
}
