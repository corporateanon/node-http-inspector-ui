import { makeStyles } from '@material-ui/core';
import { MonitorEvent } from 'http-inspector';
import React, { FC, useCallback } from 'react';
import { Lookups } from '../redux/ducks/updates';
import { Filters, initialFilters } from '../utils/Filters';
import { EventDetailsView } from './EventDetailsView';
import { MasterDetailsLayout } from './MasterDetailsLayout';
import RequestsTable from './RequestsTable';
import { ToolbarFilters } from './ToolbarFilters';

const useStyles = makeStyles((theme) => ({
    rightPanel: {
        height: '100%',
        borderLeftWidth: 1,
        borderLeftStyle: 'solid',
        borderLeftColor: theme.palette.divider,
    },
}));

export interface IMasterDetailsViewProps {
    items: Array<MonitorEvent>;
    currentItem?: MonitorEvent | null;
    onItemSelect?: (rowId: string) => void;
    onItemDeselect?: () => void;
    onFiltersChange?: (value: Filters) => void;
    filters?: Filters;
    lookups: Lookups;
}

export const MasterDetailsView: FC<IMasterDetailsViewProps> = ({
    items,
    currentItem,
    onItemSelect,
    onItemDeselect,
    lookups,
    onFiltersChange,
    filters = initialFilters,
}) => {
    const handleRowClick = useCallback(
        (rowId) => {
            onItemSelect?.(rowId);
        },
        [onItemSelect]
    );
    const handleDetailsClose = useCallback(() => {
        onItemDeselect?.();
    }, [onItemDeselect]);
    const handleFiltersChange = useCallback(
        (filters) => {
            onFiltersChange?.(filters);
        },
        [onFiltersChange]
    );

    const classes = useStyles();

    return (
        <MasterDetailsLayout
            toolbar={
                <ToolbarFilters
                    lookups={lookups}
                    onChange={handleFiltersChange}
                    value={filters}
                />
            }
            left={
                <RequestsTable
                    items={items}
                    current={currentItem ? currentItem.request.id : null}
                    onRowClick={handleRowClick}
                />
            }
            right={
                currentItem && (
                    <div className={classes.rightPanel}>
                        <EventDetailsView
                            event={currentItem}
                            onClose={handleDetailsClose}
                        />
                    </div>
                )
            }
        />
    );
};
