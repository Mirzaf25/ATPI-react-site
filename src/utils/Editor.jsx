import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

class Editor extends React.Component {
	constructor(props) {
		super(props);
		this.quillRef = null; // Quill instance
		this.reactQuillRef = null; // ReactQuill component
		this.state = {
			inputVal: '',
		};
	}

	componentDidMount() {
		this.attachQuillRefs();
	}

	componentDidUpdate({ value: prevValue }) {
		this.attachQuillRefs();
		if (this.props.value !== prevValue)
			this.setState({ inputVal: this.props.value });
	}

	attachQuillRefs = () => {
		if (typeof this.reactQuillRef.getEditor !== 'function') return;
		this.quillRef = this.reactQuillRef.getEditor();
	};

	onChange = (content, delta, source, editor) => {
		this.setState({ inputVal: content });
		this.props.onInputChange({ target: this.refs.input });
	};

	render() {
		return (
			<div>
				<ReactQuill
					ref={el => {
						this.reactQuillRef = el;
					}}
					theme={'snow'}
					onChange={this.onChange}
					value={this.state.inputVal || ''}
				/>
				<input
					type='hidden'
					value={this.state.inputVal || ''}
					name={this.props.fieldName || ''}
					data-field={this.props.dataName || ''}
					ref='input'
				/>
			</div>
		);
	}
}

export default Editor;
