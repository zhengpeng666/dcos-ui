import AceEditor from 'react-ace';
import React from 'react';
import deepEqual from 'deep-equal';

import {omit} from '../utils/Util';
import JSONUtil from '../utils/JSONUtil';

/**
 * Find the location of a change between two strings
 */
function diffLocation(oldString, newString) {
  for (var i=0, l=Math.min(oldString.length, newString.length); i<l; ++i) {
    if (oldString[i] !== newString[i]) {
      return i;
    }
  }
  return -1;
}

const METHODS_TO_BIND = [
  'handleBlur',
  'handleChange',
  // 'handleKeyDown',
  'handleEditorLoad'
];

class JSONEditor extends React.Component {
  constructor() {
    super(...arguments);

    this.state = {
      textValue: '{}',
      objectValue: {},
      objectInfo: []
    };

    this.aceEditor = null;

    // Caching information used by the `getJSONMetaInfo` function
    this.metaBuffer = '';
    this.metaInfo = {};

    METHODS_TO_BIND.forEach((method) => {
      this[method] = this[method].bind(this);
    });
  }

  /**
   * This function processes the given JSON buffer (that may be different than
   * the actual JSON string in the editor) returns it's object metadata.
   *
   * This function caches the response and it won't re-process the JSON string
   * if it's been given the same input.
   *
   * This is useful in order to have the latest available metainformation when
   * the user changes the text (on the `handleChange` handler), but we don't
   * want to re-do the processing when this will eventually trigger an update
   * to the `value` property with the same data.
   *
   * @param {String} buffer - The JSON buffer to extract metadata from
   * @returns {Array} Returns the metadata info for the given JSON string
   */
  getJSONMetaInfo(buffer) {
    if (this.metaBuffer === buffer) {
      return this.metaInfo;
    }

    let meta = this.metaInfo;
    try {
      meta = JSONUtil.getObjectInformation(buffer);
    } catch (e) {
    }

    this.metaBuffer = buffer;
    this.metaInfo = meta;
    return meta;
  }

  componentWillReceiveProps(nextProps) {
    let newState = {
      textValue: nextProps.value
    };

    try {
      newState.objectValue = JSON.parse(nextProps.value);
      newState.objectInfo = this.getJSONMetaInfo(nextProps.value);
    } catch (e) {
    }

    this.setState(newState);
  }

  shouldComponentUpdate(nextProps, nextState) {

    if ((nextState.textValue !== this.state.textValue)) {
      return true;
    }

    let newObj = this.state.objectValue;
    try {
      newObj = JSON.parse(nextProps.value);
    } catch (e) {
      // We were given a new value. If this new value has errors we bypass the
      // smart diff detection and we forcefully update the entire document,
      // including it's errors.
      return true;
    }

    // We should update if the object is the same
    return !deepEqual(this.state.objectValue, newObj);
  }

  handleBlur(event) {
    this.props.onBlur(event);
  }

  handleChange(value) {

    //
    let c = this.aceEditor.getSession().getSelection().getCursor();
    console.log(c);
    let metaInfo = this.getJSONMetaInfo(value);

    // Get the position of the change
    let cursor = diffLocation(this.props.value, value);

    // Tokenize new value
    let editedToken = metaInfo.reverse().find(function (token) {
      return (cursor >= token.pos[0]) && (cursor <= token.pos[1]);
    });

    console.log('Change at', cursor, '(' + this.props.value[cursor] + '), path=/', editedToken && editedToken.path.join('/'));
    // console.log('change>', value);
    this.props.onChange(value);
  }

  // handleKeyDown(event) {
  //   console.log('key=', event.keyCode);
  //   if ((event.keyCode === 38) || (event.keyCode === 40)) {
  //     // Up/Down Key

  //   } else if ((event.keyCode === 37) || (event.keyCode === 39)) {
  //     // Left/Right Key

  //   }
  // }

  handleEditorLoad(editor) {
    this.aceEditor = editor;
    window.editor = editor;
    this.applyEditorState();
  }

  applyEditorState() {
    if (!this.aceEditor) {
      return;
    }

    // let currentMarkers = this.aceEditor.getSession().getMarkers(true);
    // for (const i in currentMarkers) {
    //   if (currentMarkers.hasOwnProperty(i)) {
    //     this.aceEditor.getSession().removeMarker(currentMarkers[i].id);
    //   }
    // }

    // this.aceEditor.getSession().setmarkers(annotations);
  }

  render() {
    let {width, height, editorProps} = this.props;
    let {textValue} = this.state;
    let omitKeys = [].concat(
      Object.keys(JSONEditor.propTypes),
      'mode'
    );

    this.applyEditorState();

    let annotations = this.state.objectInfo.map(function (e) {
      return {
        row: e.line-1,
        column: 4,
        type: 'error',
        text: e.type
      };
    });
    console.log('-', annotations.length, 'annotations');

    // console.log('<render', value);
    // onKeyDown={this.handleKeyDown}
    return (
      <div style={{width, height}}>
        <AceEditor
          {...omit(this.props, omitKeys)}
          editorProps={editorProps}
          annotations={annotations}
          mode="json"
          onBlur={this.handleBlur}
          onChange={this.handleChange}
          onLoad={this.handleEditorLoad}
          value={textValue}
          />
      </div>
    );
  }
};

JSONEditor.defaultProps = {
  errors: [],
  editorProps: {$blockScrolling: Infinity},
  height: '100%',
  onBlur() {},
  onChange() {},
  onPropertyChange() {},
  value: '{}',
  width: '100%'
};

JSONEditor.propTypes = {
  errors: React.PropTypes.array,
  editorProps: React.PropTypes.object,
  height: React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.number
  ]),
  onBlur: React.PropTypes.func,
  onChange: React.PropTypes.func,
  onPropertyChange: React.PropTypes.func,
  value: React.PropTypes.string,
  width: React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.number
  ])
};

module.exports = JSONEditor;
