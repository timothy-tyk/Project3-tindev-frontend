import React from "react";
import {
  Editor,
  EditorState,
  editorState,
  getDefaultKeyBinding,
  RichUtils,
} from "draft-js";
import "./RichText.css";
import "../../node_modules/draft-js/dist/Draft.css";
import { convertToRaw, convertFromRaw } from "draft-js";

class RichTextDisplayForEdits extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editorState: EditorState.createEmpty(),
      text: this.props.richText,
    };
    this.focus = () => this.refs.editor.focus();
  }

  render() {
    const { editorState } = this.state;

    // If the user changes block type before entering any text, we can
    // either style the placeholder or hide it. Let's just hide it now.
    let className = "RichEditor-editor";

    return (
      <div>
        <div className="RichEditor-root">
          <Editor
            blockStyleFn={getBlockStyle}
            customStyleMap={styleMap}
            //grab the JSON string from Database and set it as the state to display
            editorState={EditorState.createWithContent(
              convertFromRaw(JSON.parse(this.state.text))
            )}
            handleKeyCommand={this.handleKeyCommand}
            keyBindingFn={this.mapKeyToEditorCommand}
            onChange={this.onChange}
            ref="editor"
            spellCheck={true}
            //read only - just to display
            readOnly={true}
          />
        </div>
      </div>
    );
  }
}

// Custom overrides for "code" style.
const styleMap = {
  CODE: {
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
    fontSize: 16,
    padding: 2,
  },
};

function getBlockStyle(block) {
  switch (block.getType()) {
    case "blockquote":
      return "RichEditor-blockquote";
    default:
      return null;
  }
}

class StyleButton extends React.Component {
  constructor() {
    super();
    this.onToggle = (e) => {
      e.preventDefault();
      this.props.onToggle(this.props.style);
    };
  }

  render() {
    let className = "RichEditor-styleButton";
    if (this.props.active) {
      className += " RichEditor-activeButton";
    }

    return (
      <span className={className} onMouseDown={this.onToggle}>
        {this.props.label}
      </span>
    );
  }
}

export default RichTextDisplayForEdits;
