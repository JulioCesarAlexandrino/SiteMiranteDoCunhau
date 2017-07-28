'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) {if (window.CP.shouldStopExecution(2)){break;} var source = arguments[i]; for (var key in source) {if (window.CP.shouldStopExecution(1)){break;} if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } }
window.CP.exitedLoop(1);
 }
window.CP.exitedLoop(2);
 return target; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// IMPORT DRAFT COMPONENTS
var _Draft = Draft;
var Editor = _Draft.Editor;
var EditorState = _Draft.EditorState;
var RichUtils = _Draft.RichUtils;
var CompositeDecorator = _Draft.CompositeDecorator;

////////////////////////////
// TAG HANDLING eg. @rkpasia

var TAG_REGEX = /\@[\w]+/g;
function tagHandle(contentBlock, callback) {
  findWithRegex(TAG_REGEX, contentBlock, callback);
}

function findWithRegex(regex, contentBlock, callback) {
  var text = contentBlock.getText();
  var matchArr = undefined,
      start = undefined;
  while ((matchArr = regex.exec(text)) !== null) {if (window.CP.shouldStopExecution(3)){break;}
    start = matchArr.index;
    callback(start, start + matchArr[0].length);
  }
window.CP.exitedLoop(3);

}

var styles = {
  tag: {
    color: 'rgba(98, 177, 254, 1.0)',
    direction: 'ltr',
    unicodeBidi: 'bidi-override'
  }
};

var Tag = function Tag(props) {
  return React.createElement(
    'span',
    _extends({}, props, { style: styles.tag }),
    props.children
  );
};

// END TAG HANDLING
///////////////////

///////////////////
// EDITOR COMPONENT

var CodepenCommentEditor = function (_React$Component) {
  _inherits(CodepenCommentEditor, _React$Component);

  function CodepenCommentEditor(props) {
    _classCallCheck(this, CodepenCommentEditor);

    // Defining decorator

    var _this = _possibleConstructorReturn(this, _React$Component.call(this, props));

    var compositeDecorator = new CompositeDecorator([{
      strategy: tagHandle,
      component: Tag
    }]);

    // Connect the decorator to the obj entity
    _this.state = { editorState: EditorState.createEmpty(compositeDecorator) };

    _this.focus = function () {
      return _this.refs.editor.focus();
    };
    _this.onChange = function (editorState) {
      return _this.setState({ editorState: editorState });
    };

    _this.handleKeyCommand = function (command) {
      return _this._handleKeyCommand(command);
    };
    _this.toggleBlockType = function (type) {
      return _this._toggleBlockType(type);
    };
    _this.toggleInlineStyle = function (style) {
      return _this._toggleInlineStyle(style);
    };
    return _this;
  }

  CodepenCommentEditor.prototype._handleKeyCommand = function _handleKeyCommand(command) {
    var editorState = this.state.editorState;

    var newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      this.onChange(newState);
      return true;
    }
    return false;
  };

  CodepenCommentEditor.prototype._toggleBlockType = function _toggleBlockType(blockType) {
    this.onChange(RichUtils.toggleBlockType(this.state.editorState, blockType));
  };

  CodepenCommentEditor.prototype._toggleInlineStyle = function _toggleInlineStyle(inlineStyle) {
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, inlineStyle));
  };

  CodepenCommentEditor.prototype.render = function render() {
    var editorState = this.state.editorState;

    var className = 'CodepenCommentEditor-editor';
    var contentState = editorState.getCurrentContent();
    if (!contentState.hasText()) {
      if (contentState.getBlockMap().first().getType() !== 'unstyled') {
        className += ' CodepenCommentEditor-hidePlaceholder';
      }
    }

    var selectionState = editorState.getSelection();

    if (selectionState.getHasFocus()) {
      className += ' CodepenCommentEditor-focus';
    }

    return React.createElement(
      'div',
      { className: 'CodepenCommentEditor-root' },
      React.createElement(InlineStyleControls, {
        editorState: editorState,
        onToggle: this.toggleInlineStyle
      }),
      React.createElement(BlockStyleControls, {
        editorState: editorState,
        onToggle: this.toggleBlockType
      }),
      React.createElement(
        'div',
        { className: className, onClick: this.focus },
        React.createElement(Editor, {
          blockStyleFn: getBlockStyle,
          customStyleMap: styleMap,
          editorState: editorState,
          handleKeyCommand: this.handleKeyCommand,
          onChange: this.onChange,
          placeholder: 'Be cool.',
          ref: 'editor',
          spellCheck: true
        })
      ),
      React.createElement(SubmitButton, { editorState: editorState })
    );
  };

  return CodepenCommentEditor;
}(React.Component);

// Styles for blocks

var styleMap = {
  CODE: {
    display: 'inline-block',
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
    fontSize: 16,
    padding: 2,
    marginTop: 3
  },
  LINK: {
    color: '#76daff'
  }
};

function getBlockStyle(block) {
  switch (block.getType()) {
    case 'blockquote':
      return 'CodepenCommentEditor-blockquote';
    default:
      return null;
  }
}

////////////////////
// BUTTONS COMPONENT

var StyleButton = function (_React$Component2) {
  _inherits(StyleButton, _React$Component2);

  function StyleButton() {
    _classCallCheck(this, StyleButton);

    var _this2 = _possibleConstructorReturn(this, _React$Component2.call(this));

    _this2.onToggle = function (e) {
      e.preventDefault();
      _this2.props.onToggle(_this2.props.style);
    };
    return _this2;
  }

  StyleButton.prototype.render = function render() {
    var className = 'CodepenCommentEditor-styleButton';
    if (this.props.active) {
      className += ' CodepenCommentEditor-activeButton';
    }

    return React.createElement(
      'span',
      { className: className, onMouseDown: this.onToggle },
      this.props.label
    );
  };

  return StyleButton;
}(React.Component);

//////////////////////////
// SUBMIT BUTTON COMPONENT

var SubmitButton = function (_React$Component3) {
  _inherits(SubmitButton, _React$Component3);

  function SubmitButton(props) {
    _classCallCheck(this, SubmitButton);

    var _this3 = _possibleConstructorReturn(this, _React$Component3.call(this, props));

    _this3.onToggle = function (e) {
      var markup = {
        'BOLD': ['<strong>', '</strong>'],
        'ITALIC': ['<em>', '</em>'],
        'LINK': ['<a href="#">', '</a>'],
        'CODE': ['<code>', '</code>']
      };
      e.preventDefault();
      var editorState = _this3.props.editorState;
      console.log(Draft.convertToRaw(editorState.getCurrentContent()));
      console.log(buildMarkup(Draft.convertToRaw(editorState.getCurrentContent()), markup));
      var markuppedBlocks = buildMarkup(Draft.convertToRaw(editorState.getCurrentContent()), markup);
      var commentContent = function commentContent(blocks) {
        var commentText = "";
        blocks.forEach(function (block, index, arr) {
          if (block.blockType == "unstyled") commentText += "<p>" + block.styledMarkup + "</p>";
          if (block.blockType == "blockquote") commentText += "<blockquote>" + block.styledMarkup + "</blockquote>";
          if (block.blockType == "code-block") commentText += "<div class='box'><pre style='white-space: pre-wrap;'><code>" + block.styledMarkup + "</code></pre></div>";
        });
        return commentText;
      };
      var comment = commentContent(markuppedBlocks);
      $('#comments-container').append('\n          <div class="comment">\n        <div class="comment-user">\n          <div class="avatar"><img src="//s3-us-west-2.amazonaws.com/s.cdpn.io/49366/profile/profile-80_1.jpg" alt="Riccardo"/></div><span class="user-details"><span class="username">Riccardo </span><span>on </span><span>MARCH 7, 2016</span></span>\n        </div>\n        <div class="comment-text">\n          ' + comment + '\n        </div>\n      </div>\n      ');
    };
    return _this3;
  }

  SubmitButton.prototype.render = function render() {
    var className = 'CodepenCommentEditor-submitButton';

    return React.createElement(
      'span',
      { className: className, onMouseDown: this.onToggle },
      'Submit'
    );
  };

  return SubmitButton;
}(React.Component);

//////////////
// BLOCK TYPES

var BLOCK_TYPES = [{ label: 'Quote', style: 'blockquote' }, { label: 'Block Code', style: 'code-block' }];

var BlockStyleControls = function BlockStyleControls(props) {
  var editorState = props.editorState;

  var selection = editorState.getSelection();
  var blockType = editorState.getCurrentContent().getBlockForKey(selection.getStartKey()).getType();

  return React.createElement(
    'span',
    { className: 'CodepenCommentEditor-controls' },
    BLOCK_TYPES.map(function (type) {
      return React.createElement(StyleButton, {
        key: type.label,
        active: type.style === blockType,
        label: type.label,
        onToggle: props.onToggle,
        style: type.style
      });
    })
  );
};

////////////////
// INLINE_STYLES

var INLINE_STYLES = [{ label: 'Bold', style: 'BOLD' }, { label: 'Italic', style: 'ITALIC' }, { label: 'Link', style: 'LINK' }, { label: 'Inline Code', style: 'CODE' }];

var InlineStyleControls = function InlineStyleControls(props) {
  var currentStyle = props.editorState.getCurrentInlineStyle();
  return React.createElement(
    'span',
    { className: 'CodepenCommentEditor-controls' },
    INLINE_STYLES.map(function (type) {
      return React.createElement(StyleButton, {
        key: type.label,
        active: currentStyle.has(type.style),
        label: type.label,
        onToggle: props.onToggle,
        style: type.style
      });
    })
  );
};

ReactDOM.render(React.createElement(CodepenCommentEditor, null), document.getElementById('comment-form'));

///////////////
// DEPENDENCIES

// values in haystack must be unique
function containsSome(haystack, needles) {
  return haystack.length > _.difference(haystack, needles).length;
}

function relevantStyles(offset, styleRanges) {
  var styles = _.filter(styleRanges, function (range) {
    return offset >= range.offset && offset < range.offset + range.length;
  });
  return styles.map(function (style) {
    return style.style;
  });
}

function buildMarkup(rawDraftContentState, markup) {

  var blocks = rawDraftContentState.blocks;
  return blocks.map(function convertBlock(block) {

    var outputText = [];
    var styleStack = [];
    var text = block.text;
    var ranges = block.inlineStyleRanges;
    var type = block.type;

    // loop over every char in this block's text
    for (var i = 0; i < text.length; i++) {if (window.CP.shouldStopExecution(5)){break;}

      // figure out what styles this char and the next char need
      // (regardless of whether there *is* a next char or not)
      var characterStyles = relevantStyles(i, ranges);
      var nextCharacterStyles = relevantStyles(i + 1, ranges);

      // calculate styles to add and remove
      var stylesToAdd = _.difference(characterStyles, styleStack);
      var stylesToRemove = _.difference(characterStyles, nextCharacterStyles);

      // add styles we will need for this char
      stylesToAdd.forEach(function (style) {
        styleStack.push(style);
        outputText.push(markup[style][0]);
      });

      outputText.push(text.substr(i, 1));

      // remove styles we won't need anymore
      while (containsSome(styleStack, stylesToRemove)) {if (window.CP.shouldStopExecution(4)){break;}
        var toRemove = styleStack.pop();
        outputText.push(markup[toRemove][1]);
      }
window.CP.exitedLoop(4);

    }
window.CP.exitedLoop(5);


    return {
      blockType: type,
      styledMarkup: outputText.join('')
    };
  });
}