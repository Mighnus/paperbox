Window = React.createClass({
  getInitialState: function() {
    return { pdfBlob: null };
  },
  generatePdf: function(params) {
    images = {
      boxFront: params.imageBoxFront
    };
    return makeBox(params.paper,
      params.height, params.width, params.depth,
      params.inside, params.color, images);
  },
  generatePreview: function(params) {
    this.setState({pdfBlob: this.generatePdf(params).buildPdfUriString()});
  },
  downloadPdf: function(params) {
    this.generatePdf(params).save();
  },
  render: function() {
    return (
      <div className="app">
        <Configurator onRebuildPreview={this.generatePreview} onDownload={this.downloadPdf} />
        <PreviewPane pdfBlob={this.state.pdfBlob}/>
        <h3>
          When you print, make sure you print at 100% size.
        </h3>
      </div>
    );
  }
});

Configurator = React.createClass({
  getInitialState: function() {
    return {
      paper: 'letter',
      inside: 'none',
      height: 3.5,
      width: 2.5,
      depth: 1
    };
  },
  buildMeasurements: function() {
    var props = ['width', 'height', 'depth'];
    var measurements = {
      inside: this.state.inside,
      paper: this.state.paper,
      imageBoxFront: this.state.imageBoxFront
    };
    var hasInvalid = false;
    props.forEach(function(prop) {
      var val = Number(this.state[prop]);
      if (val > 0) {
        measurements[prop] = val;
      } else {
        hasInvalid = true;
      }
    }.bind(this));
    var hexMatcher = /^[0-9a-f]{6}/i;
    if (hexMatcher.test(this.state.color)) {
      measurements.color = this.state.color;
    }
    if (!hasInvalid) {
      return measurements;
    }
  },
  componentDidMount: function() {
    this.handleSubmit();
  },
  handleSubmit: function(e) {
    if (e) {
      e.preventDefault();
    }
    var measurements = this.buildMeasurements();
    if (measurements) {
      this.props.onRebuildPreview(measurements);
    }
  },
  handleDownload: function(e) {
    var measurements = this.buildMeasurements();
    if (measurements) {
      this.props.onDownload(measurements);
    }
  },
  changeState: function(key, val) {
    var newProp = {};
    newProp[key] = val;
    var newState = _.assign(this.state, newProp);
    if (key === 'color' && val && val.length === 6) {
      newState.colorStyle = {
        backgroundColor: '#' + val
      };
    }
    this.setState(newState);
  },
  widthChange: function(e) {
    this.changeState('width', e.target.value)
  },
  heightChange: function(e) {
    this.changeState('height', e.target.value)
  },
  depthChange: function(e) {
    this.changeState('depth', e.target.value)
  },
  colorChange: function(e) {
    this.changeState('color', e.target.value)
  },
  insideChange: function(e) {
    this.changeState('inside', e.target.value)
  },
  paperChange: function(e) {
    this.changeState('paper', e.target.value)
  },
  imageBoxFrontChange: function(e) {
    if (e.target.files) {
      var file = e.target.files[0];
      var reader = new FileReader();
      var _this = this;
      reader.onload = function(e) {
        var datauri = e.target.result;
        _this.changeState('imageBoxFront', datauri);
      };
      reader.readAsDataURL(file);
    } else {
      this.changeState('imageBoxFront', null);
    }
  },
  render: function() {
    return (
      <form className="container configurator form-horizontal" onSubmit={this.handleSubmit}>
        <div className="form-group">
          <label className="control-label">
            <span className="col-xs-4">Paper Size</span>
            <div className="col-xs-8">
              <select
                className="form-control" ref="paper"
                onChange={this.paperChange} value={this.state.paper}
              >
                <option value="letter">Letter</option>
                <option value="a4">A4</option>
              </select>
            </div>
          </label>
        </div>
        <div className="form-group">
          <label className="control-label col-xs-offset-2 col-xs-10">
            All measurements are in Inches
          </label>
        </div>
        <div className="form-group">
          <label className="control-label">
            <span className="col-xs-4">Card width</span>
            <div className="col-xs-8">
              <input
                className="form-control" type="text" ref="width"
                onChange={this.widthChange} value={this.state.width}
              />
            </div>
          </label>
        </div>
        <div className="form-group">
          <label className="control-label">
            <span className="col-xs-4">Card height</span>
            <div className="col-xs-8">
              <input
                className="form-control" type="text" ref="height"
                onChange={this.heightChange} value={this.state.height}
              />
            </div>
          </label>
        </div>
        <div className="form-group">
          <label className="control-label">
            <span className="col-xs-4">Box depth</span>
            <div className="col-xs-8">
              <input
                className="form-control" type="text" ref="depth"
                onChange={this.depthChange} value={this.state.depth}
              />
            </div>
          </label>
        </div>
        <div className="form-group">
          <label className="control-label">
            <span className="col-xs-4">Box Color</span>
            <div className="col-xs-6">
              <input
                className="form-control" type="text" ref="depth"
                onChange={this.colorChange} value={this.state.color}
              />
            </div>
            <div className="col-xs-1" style={this.state.colorStyle}>&nbsp;</div>
          </label>
        </div>
        <div className="form-group">
          <label className="control-label">
            <span className="col-xs-4">Drawer Style</span>
            <div className="col-xs-8">
              <select
                className="form-control" ref="inside"
                onChange={this.insideChange} value={this.state.inside}
              >
                <option value="tray">Tray</option>
                <option value="sleeve">Sleeve</option>
                <option value="none">None</option>
              </select>
            </div>
          </label>
        </div>
        <div className="form-group">
          <label className="control-label">
            <span className="col-xs-4">Box Front</span>
            <div className="col-xs-8">
              <input
                className="form-control" type="file" ref="imageBoxFront"
                onChange={this.imageBoxFrontChange}
              />
            </div>
          </label>
        </div>
        <div className="form-group">
          <div className="col-xs-offset-4 col-xs-8">
            <button className="btn btn-default" type="submit">Preview</button>
            <button className="btn btn-default" onClick={this.handleDownload}>Download</button>
          </div>
        </div>
      </form>
    );
  }
});

PreviewPane = React.createClass({
  render: function() {
    return (<iframe className="preview" type="application/pdf" frameborder="0" src={this.props.pdfBlob} />);
  }
});

React.render(<Window />, document.body);
