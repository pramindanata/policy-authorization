import { AnyFunction, Ctor } from './common';

export class Ability {
  constructor(
    private user: Record<any, any>,
    private modelPolicyDict: ModelPolicyDict,
  ) {}

  can<M>(action: string, model: PolicyModel<M>): boolean {
    const modelName = this.getModelName(model);
    const policy = this.modelPolicyDict[modelName];

    if (!policy) {
      throw new PolicyNotFoundException(modelName);
    }

    const policyMethod = policy[action] as AnyFunction<boolean>;

    if (!policyMethod) {
      throw new ActionNotFoundException(action);
    }

    return policyMethod.apply(policy, [this.user, model]);
  }

  cant<M>(action: string, model: PolicyModel<M>): boolean {
    return !this.can(action, model);
  }

  private getModelName(model: PolicyModel<any>): string {
    if (typeof model === 'string') {
      return model;
    }

    if (typeof model === 'object') {
      return model.constructor.name;
    }

    return model.name;
  }
}

export class PolicyNotFoundException extends Error {
  constructor(model: string) {
    super(`Policy for model "${model}" does not found`);
  }
}

export class ActionNotFoundException extends Error {
  constructor(action: string) {
    super(`Action "${action}" does not found`);
  }
}

export interface ModelPolicyDict {
  [key: string]: Record<string, any>;
}

export type PolicyModel<M> = Ctor<M> | M | string;
