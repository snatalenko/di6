declare class ContainerBuilder {

	constructor(options?: { types?: Array<TypeConfig>, singletones?: TParameterObject }): ContainerBuilder;

	/** Register type or factory */
	register<T>(Type: TClassOrFactory<T>, alias?: string): TypeConfig<T>;

	/**
	 * Register instance
	 * (which will be a singleton with an alias)
	 */
	registerInstance<T>(instance: T, alias: string): TypeConfig<T>;

	/** Create container with the registered types */
	container(): Container;
}