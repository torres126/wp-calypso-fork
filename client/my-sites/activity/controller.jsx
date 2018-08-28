/** @format */
/**
 * External dependencies
 */
import React from 'react';
import i18n from 'i18n-calypso';
import { isEqual } from 'lodash';

/**
 * Internal Dependencies
 */
import { getSelectedSiteId } from 'state/ui/selectors';
import getActivityLogFilter from 'state/selectors/get-activity-log-filter';
import ActivityLog from 'my-sites/activity/activity-log';
import { setFilter } from 'state/activity-log/actions';
import { queryToFilterState } from 'state/activity-log/utils';

export function activity( context, next ) {
	const state = context.store.getState();
	const siteId = getSelectedSiteId( state );
	const startDate = i18n.moment( context.query.startDate, 'YYYY-MM-DD' ).isValid()
		? context.query.startDate
		: undefined;

	const filter = getActivityLogFilter( state, siteId );
	const queryFilter = queryToFilterState( context.query );

	if ( ! isEqual( filter, queryFilter ) ) {
		context.store.dispatch( {
			...setFilter( siteId, queryFilter ),
			meta: { skipUrlUpdate: true },
		} );
	}

	context.primary = <ActivityLog siteId={ siteId } context={ context } startDate={ startDate } />;

	next();
}
