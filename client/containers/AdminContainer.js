import React, {Component} from 'react';
import enUS from 'antd/lib/locale-provider/en_US';
import {Menu, Icon, LocaleProvider, Spin} from 'antd';
import {Link, browserHistory} from 'react-router'
import {Meteor} from 'meteor/meteor';

import 'antd/dist/antd.css';

const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

class AdminContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            current: 'mail'
        }
    }

    handleClick() {

    }

    render() {
        const {children} = this.props;

        let items = [
                    <Menu.Item key="home">
                        <Link to={`/admin`}>
                            <Icon type="home"/>
                            Home
                        </Link>
                    </Menu.Item>,
                    <Menu.Item key="rounds">
                        <Link to={`/admin`}>
                            <Icon type="appstore"/>
                            Rondes
                        </Link>
                    </Menu.Item>,
                    <Menu.Item key="controller">
                        <Link to={`/admin/controller`}>
                            <Icon type="smile"/>
                            Controller
                        </Link>
                    </Menu.Item>
        ];




        const menu = <Menu
                    onClick={this
                    .handleClick
                    .bind(this)}
                    selectedKeys={[this.state.current]}
                    mode="horizontal">

                   {items}



                </Menu>

        return (
            <LocaleProvider locale={enUS}>
                <div>
                    {menu}
                    <div style={{ padding: '10px'}}>
                      {children}
                    </div>
                </div>

            </LocaleProvider>
        )
    }
}

export default AdminContainer;
