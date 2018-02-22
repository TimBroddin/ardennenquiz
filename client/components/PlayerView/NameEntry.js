import React, {Component} from 'react';
import {setName} from './actions';
import {connect} from 'react-redux';

class NameEntry extends Component {
    render() {
        const {setName} = this.props;

        return <div>
            <h1>Vul je naam in</h1>
            <form>
                <p><input type="text" ref="name"/></p>
                <p><input type="button" value="Meedoen" onClick={(e) => setName(this.refs.name.value)}/></p>
            </form>
        </div>
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        setName: (name) => {
            console.log(name);
            console.log(setName(name));
            dispatch(setName(name));
        }
    }

}

export default connect(null, mapDispatchToProps)(NameEntry);
