/*
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {buildMessageTypeOptions, matchesTopicTypeFilter} from './topicType';

const buildFilters = (overrides) => ({
    filterRetry: false,
    filterDLQ: false,
    filterSystem: false,
    filterUnspecified: false,
    filterNormal: true,
    filterDelay: false,
    filterFifo: false,
    filterTransaction: false,
    filterMixed: false,
    mixedTypeEnabled: false,
    rmqVersion: true,
    ...overrides,
});

test('hides MIXED from the message type options while the switch is off', () => {
    const values = buildMessageTypeOptions(false).map(option => option.value);

    expect(values).toEqual(['TRANSACTION', 'FIFO', 'DELAY', 'NORMAL']);
});

test('offers MIXED from the message type options once the switch is on', () => {
    const values = buildMessageTypeOptions(true).map(option => option.value);

    expect(values).toEqual(['TRANSACTION', 'FIFO', 'DELAY', 'NORMAL', 'MIXED']);
});

test('keeps MIXED topics hidden while the switch is off even when the filter is ticked', () => {
    const filters = buildFilters({filterNormal: false, filterMixed: true, mixedTypeEnabled: false});

    expect(matchesTopicTypeFilter('MIXED', filters)).toBe(false);
});

test('shows MIXED topics once the switch and the filter are both on', () => {
    const filters = buildFilters({filterNormal: false, filterMixed: true, mixedTypeEnabled: true});

    expect(matchesTopicTypeFilter('MIXED', filters)).toBe(true);
});

test('keeps the historical type filters unchanged', () => {
    expect(matchesTopicTypeFilter('NORMAL', buildFilters({}))).toBe(true);
    expect(matchesTopicTypeFilter('FIFO', buildFilters({filterNormal: false, filterFifo: true}))).toBe(true);
    expect(matchesTopicTypeFilter('RETRY_GROUP', buildFilters({filterNormal: false, filterRetry: true}))).toBe(true);
    expect(matchesTopicTypeFilter('DLQ_GROUP', buildFilters({filterNormal: false, filterDLQ: true}))).toBe(true);
    expect(matchesTopicTypeFilter('MIXED', buildFilters({filterNormal: false}))).toBe(false);
});
