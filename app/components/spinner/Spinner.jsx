import React from 'react';
import { CircularProgress } from 'material-ui';

export default class Spinner extends React.Component {
    render () {
        return (
            <div>
                <CircularProgress />
            </div>
        );
    }
}
