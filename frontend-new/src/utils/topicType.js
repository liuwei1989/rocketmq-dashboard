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

export const buildMessageTypeOptions = (mixedTypeEnabled) => {
    const options = [
        {value: 'TRANSACTION', label: 'TRANSACTION'},
        {value: 'FIFO', label: 'FIFO'},
        {value: 'DELAY', label: 'DELAY'},
        {value: 'NORMAL', label: 'NORMAL'},
    ];
    if (mixedTypeEnabled) {
        options.push({value: 'MIXED', label: 'MIXED'});
    }
    return options;
};

export const matchesTopicTypeFilter = (type, filters) => {
    const topicType = type || '';
    if (filters.filterRetry && topicType.includes('RETRY')) return true;
    if (filters.filterDLQ && topicType.includes('DLQ')) return true;
    if (filters.filterSystem && topicType.includes('SYSTEM')) return true;
    if (filters.rmqVersion && filters.filterUnspecified && topicType.includes('UNSPECIFIED')) return true;
    if (filters.filterNormal && topicType.includes('NORMAL')) return true;
    if (!filters.rmqVersion && filters.filterNormal && topicType.includes('UNSPECIFIED')) return true;
    if (filters.rmqVersion && filters.filterDelay && topicType.includes('DELAY')) return true;
    if (filters.rmqVersion && filters.filterFifo && topicType.includes('FIFO')) return true;
    if (filters.rmqVersion && filters.filterTransaction && topicType.includes('TRANSACTION')) return true;
    if (filters.mixedTypeEnabled && filters.filterMixed && topicType.includes('MIXED')) return true;

    return false;
};
