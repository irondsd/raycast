import { useRef } from "react"
import { Form, ActionPanel, Action, Clipboard, closeMainWindow, showHUD, popToRoot } from "@raycast/api"

type Values = {
  textarea: string
  format: string
}

export default function Command() {
  const textAreaRef = useRef<Form.TextArea>(null)
  const formatRef = useRef<Form.DatePicker>(null)

  function handleSubmit(values: Values) {
    if (values.format === 'unformat') {
      let json = values.textarea
      json = json.replaceAll(/(\r\n|\n|\r)/gm, "")
      json = json.replaceAll(' ', '')

      Clipboard.copy(json)

      textAreaRef.current?.reset()
      formatRef.current?.reset()
      
      showHUD('Copied 👍')
    } else {
      try {
        const ugly = values.textarea
        const obj = JSON.parse(ugly)
        const pretty = JSON.stringify(obj, undefined, 4)

        Clipboard.copy(pretty)

        textAreaRef.current?.reset()
        formatRef.current?.reset()

        showHUD('Copied 👍')
      } catch (error) {
        showHUD('Incorrect JSON ❌')
      }
    }

    closeMainWindow()
    popToRoot()
  }

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm onSubmit={handleSubmit} />
          <Action title="Reset TextField" onAction={() => textAreaRef.current?.reset()} />
          <Action title="Reset TextArea" onAction={() => formatRef.current?.reset()} />
        </ActionPanel>
      }
    >
      <Form.Description text="Paste JSON in the text area below" />
      <Form.TextArea id="textarea" title="Text area" placeholder="Past JSON here" ref={textAreaRef} />
      <Form.Dropdown id="format" title="Format type" ref={formatRef} >
        <Form.Dropdown.Item value="format" title="Format" />
        <Form.Dropdown.Item value="unformat" title="Unformat" />
      </Form.Dropdown>
    </Form>
  )
}
