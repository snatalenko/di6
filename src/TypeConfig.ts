import { Container } from "./Container";
import { TClassOrFactory } from "./TClassOrFactory";
import { INSTANCE_PER_CONTAINER, INSTANCE_PER_DEPENDENCY, INSTANCE_SINGLE, TInstanceType } from "./TInstanceType";

export class TypeConfig<T> {

	/** Unique type configuration identifier */
	id: symbol;

	/** List of type aliases */
	aliases: string[] = [];

	/** How to instantiate the type */
	instanceType: TInstanceType = INSTANCE_PER_CONTAINER;

	/** Type instance factory */
	factory: (container: Container) => T;

	/**
	 * Creates an instance of TypeConfig<T>
	 */
	constructor(Type: TClassOrFactory<T>) {
		if (typeof Type !== 'function')
			throw new TypeError('Type argument must be a Function');
		if (Type.length > 1)
			throw new TypeError('Type cannot have more than 1 argument');

		this.id = Symbol(Type.name);
		this.factory = container => container.createInstance(Type);
	}

	/**
	 * Instruct to expose object instance on container instance with a given `alias`.
	 * The alias will be used to inject object instance as dependency to other types.
	 */
	as(alias: string): TypeConfig<T> {
		if (typeof alias !== 'string' || !alias.length)
			throw new TypeError('Alias argument must be a non-empty String');
		if (this.aliases.includes(alias))
			throw new TypeError(`Alias "${alias}" is already registered for the type`);

		const forbiddenAliases = [
			Container.prototype.get.name,
			Container.prototype.getAll.name,
			Container.prototype.createInstance.name
		];
		if (forbiddenAliases.includes(alias))
			throw new TypeError(`Alias "${alias}" conflicts with container method`);

		this.aliases.push(alias);
		return this;
	}

	/**
	 * Instruct to create object instances once per containers tree
	 * (current container and derived containers)
	 */
	asSingleInstance(): TypeConfig<T> {
		this.instanceType = INSTANCE_SINGLE;
		return this;
	}

	/**
	 * Create instance per each dependency
	 */
	asInstancePerDependency(): TypeConfig<T> {
		this.instanceType = INSTANCE_PER_DEPENDENCY;
		return this;
	}

	/**
	 * Create instance per container (default behavior)
	 */
	asInstancePerContainer(): TypeConfig<T> {
		this.instanceType = INSTANCE_PER_CONTAINER;
		return this;
	}
}
