'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы several и through
 */
const isStar = false;

function eventNamespaceContains(namespaceName, event) {
    return event === namespaceName || event.startsWith(namespaceName + '.');
}

/**
 * Возвращает новый emitter
 * @returns {Object}
 */
function getEmitter() {
    const records = new Map();

    return {

        /**
         * Подписаться на событие
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @returns {Object}
         */
        on: function (event, context, handler) {
            const contexts = records.get(event) || new Map();
            records.set(event, contexts);
            const handlers = (records.get(event).get(context) || []);
            handlers.push(handler);
            records.get(event).set(context, handlers);

            return this;
        },

        /**
         * Отписаться от события
         * @param {String} event
         * @param {Object} context
         * @returns {Object}
         */
        off: function (event, context) {
            for (const eventName of records.keys()) {
                if (eventNamespaceContains(event, eventName)) {
                    records.get(eventName).delete(context);
                }
            }

            return this;
        },

        /**
         * Уведомить о событии
         * @param {String} event
         * @returns {Object}
         */
        emit: function (event) {
            const splittedEventName = event.split('.');

            for (let i = splittedEventName.length; i > 0; i--) {
                const eventName = splittedEventName.slice(0, i).join('.');

                if (records.has(eventName)) {
                    const contexts = records.get(eventName);
                    contexts.forEach((handlers, context) =>
                        handlers.forEach(handler =>
                            handler.call(context)));
                }
            }

            return this;
        },

        /**
         * Подписаться на событие с ограничением по количеству полученных уведомлений
         * @star
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} times – сколько раз получить уведомление
         */
        several: function (event, context, handler, times) {
            console.info(event, context, handler, times);
        },

        /**
         * Подписаться на событие с ограничением по частоте получения уведомлений
         * @star
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} frequency – как часто уведомлять
         */
        through: function (event, context, handler, frequency) {
            console.info(event, context, handler, frequency);
        }
    };
}

module.exports = {
    getEmitter,

    isStar
};
