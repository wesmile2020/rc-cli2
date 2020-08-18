import React from 'react';

export interface Route {
    component: React.ComponentClass<any> | React.FunctionComponent<any>;
    path: string;
    checkAuth?: () => boolean;
}

interface Props {
    routes: Route[];
    defaultPath?: string;
    loginPath?: string;
}

function getPath() {
    return window.location.hash.split('?')[0].replace(/#/, '');
}

function parseUrl(url: string) {
    const result: MapLike = {};
    if (!/\?/.test(url)) return result;
    const arr = url.replace(/[^]+\?/, '').split('&');
    for (let i = 0; i < arr.length; i += 1) {
        let [key, value] = arr[i].split('=');
        if (value === 'true' || value === 'false') {
            result[key] = value === 'true';
        } else {
            result[key] = value;
        }
    }
    return result;
}

class Router extends React.Component<Props> {
    state = {
        path: this.props.defaultPath || getPath() || '/',
    };

    constructor(props: Props) {
        super(props);
        this._onhashchange = this._onhashchange.bind(this);
        if (!window.location.hash) {
            window.location.hash = this.props.defaultPath || '/';
        }
        window.addEventListener('hashchange', this._onhashchange);
    }

    private _onhashchange() {
        this.setState({ path: getPath() });
    }

    componentWillUnmount() {
        window.removeEventListener('hashchange', this._onhashchange);
    }

    render() {
        const { path } = this.state;
        const { routes, loginPath } = this.props;
        const props = {
            path,
            query: parseUrl(window.location.href),
        };
        return (
            <React.Fragment>
                {routes.map((item) => {
                    if (item.path === path) {
                        if (item.checkAuth) {
                            if (item.checkAuth() || path === loginPath) {
                                return <item.component {...props}
                                    key={item.path} />;
                            } else {
                                window.location.hash = `#${loginPath || '/'}`;
                                return null;
                            }
                        } else {
                            return <item.component {...props}
                                key={item.path} />;
                        }
                    } else {
                        return null;
                    }
                })}
            </React.Fragment>
        );
    }
}

export default Router;
