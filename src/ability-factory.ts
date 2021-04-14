import { Ability, ModelPolicyDict } from './ability';
import { Ctor } from './common';

export class AbilityFactory {
  constructor(private modelPolicyCtorDict: ModelPolicyCtorDict) {}

  create(user: Record<any, any>): Ability {
    const resolvedPolicies = this.resolvePolicies();

    return new Ability(user, resolvedPolicies);
  }

  private resolvePolicies(): ModelPolicyDict {
    const resolvedPolicies: ModelPolicyDict = {};

    for (const modelName in this.modelPolicyCtorDict) {
      const ctor = this.modelPolicyCtorDict[modelName];

      resolvedPolicies[modelName] = new ctor();
    }

    return resolvedPolicies;
  }
}

export interface ModelPolicyCtorDict {
  [key: string]: Ctor;
}
