import { makeStyles } from '@material-ui/core';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import classnames from 'classnames';
import { MonitorEvent } from 'http-inspector';
import React, { FC } from 'react';

interface IRequestsTableRowProps {
    item: MonitorEvent;
    onClick?: (rowId: string) => void;
    selected?: boolean;
}

const useStyles = makeStyles((theme) => ({
    root: {
        cursor: 'pointer',
    },

    selected: {
        backgroundColor: theme.palette.primary.main,
        '& td': {
            color: theme.palette.getContrastText(theme.palette.primary.main),
        },
    },

    withError: {
        '& td': {
            color: theme.palette.error.main,
        },
        '&$selected': {
            backgroundColor: theme.palette.error.main,
            '& td': {
                color: theme.palette.getContrastText(theme.palette.error.main),
            },
        },
    },
    withWarning: {
        '& td': {
            color: theme.palette.warning.main,
        },
        '&$selected': {
            backgroundColor: theme.palette.warning.main,
            '& td': {
                color: theme.palette.getContrastText(
                    theme.palette.warning.main
                ),
            },
        },
    },
}));

const RequestsTableRow: FC<IRequestsTableRowProps> = ({
    item,
    onClick,
    selected,
}) => {
    const classes = useStyles();

    const rowClasses = classnames(
        {
            [classes.selected]: selected,
            [classes.withError]:
                !!item.error || (item.response && item.response.status >= 400),
            [classes.withWarning]:
                item.response &&
                item.response.status >= 300 &&
                item.response.status < 400,
        },
        classes.root
    );

    return (
        <TableRow
            onClick={() => onClick && onClick(item.request.id)}
            className={rowClasses}
        >
            <TableCell>{item.request.url}</TableCell>
            <TableCell>{item.request.method}</TableCell>
            <TableCell>
                {item.response ? item.response.status : ''}
                {item.error ? `(failed) ${item.error.code}` : ''}
            </TableCell>
        </TableRow>
    );
};

export default React.memo(RequestsTableRow);
