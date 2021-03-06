var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

class Head extends React.Component {
    shouldComponentUpdate(nextProps, nextState) {
        let current_widgets = this.props.widgets;
        let new_widgets = nextProps.widgets;
        var keys_old = Object.keys(current_widgets);
        var keys_new = Object.keys(new_widgets);
        if (keys_old.length !== keys_new.length) return true;
        for (var i = 0; i < keys_old.length; i++) {
            if (current_widgets[keys_old[i]]['id'] !== new_widgets[keys_new[i]]['id']) return true;
        }
        return false;
    }

    render() {
        const { widgets } = this.props;
        return React.createElement(
            'tr',
            { id: this.props.id },
            widgets.map((widget, index) => {
                let Component = widget.component;
                return React.createElement(Component, _extends({ key: widget.id }, widget.data));
            })
        );
    }
}
Head.propTypes = {
    widgets: PropTypes.arrayOf(PropTypes.shape({
        component: PropTypes.func.isRequired,
        data: PropTypes.object.isRequired,
        id: PropTypes.string.isRequired
    }))
};

const getWidgets = (widgets, id) => {
    let term = widgets !== undefined ? widgets.filter(e => {
        return e.area === id;
    }) : [];
    return term.sort(function (obj1, obj2) {
        return obj1.sort_order - obj2.sort_order;
    });
};

const mapStateToProps = (state, ownProps) => {
    return {
        widgets: getWidgets(state.widgets, ownProps.id),
        type: state.type
    };
};

export default ReactRedux.connect(mapStateToProps)(Head);