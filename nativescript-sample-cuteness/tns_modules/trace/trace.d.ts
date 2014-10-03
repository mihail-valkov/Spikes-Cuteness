declare module "trace" {
    /**
     * Enables the trace module.
     */
    function enable(): void;

    /**
     * Disables the trace module.
     */
    function disable(): void;

    /**
     * Adds a TraceWriter instance to the trace module.
     * @param writer The TraceWriter instance to add.
     */
    function addWriter(writer: TraceWriter);

    /**
     * Removes a TraceWriter instance from the trace module.
     * @param writer The TraceWriter instance to remove.
     */
    function removeWriter(writer: TraceWriter);

    /**
     * Clears all the writers from the trace module.
     */
    function clearWriters();

    /**
     * Sets the categories the module will trace.
     * @param categories The comma-separated list of categories. If not specified all messages from all categories will be traced.
     */
    function setCategories(categories: string);

    /**
     * Writes a message using the available loggers.
     * @param message The message to be written.
     * @param category The category of the message.
     * @param type Optional, the type of the message - info, warning, error.
     */
    function write(message: any, category: string, type?: number);

    /**
     * Notifies all the attached listeners for an event that has occurred in the sender object.
     * @param object The Object instance that raised the event.
     * @param name The name of the raised event.
     * @param data An optional parameter that passes the data associated with the event.
     */
    function notifyEvent(object: Object, name: string, data?: any);

    function addEventListener(listener: EventListener);

    function removeEventListener(listener: EventListener);

    module categories {
        var VisualTreeEvents: string;
        var Layout: string;
        var Style: string;
        var ViewHierarchy: string;
        var NativeLifecycle: string;
        var Navigation: string;
        var Test: string;
        var All: string;

        var separator: string;
        function concat(...categories: string[]): string;
    }

    module messageType {
        var log: number;
        var info: number;
        var warn: number;
        var error: number;
    }

    interface TraceWriter {
        write(message: any, category: string, type?: number);
    }

    interface EventListener {
        filter: string;
        on(object: Object, name: string, data?: any);
    }
}