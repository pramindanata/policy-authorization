import { Ability, SubjectPolicyDict } from './ability';
import { Ctor } from './common';

export class AbilityFactory {
  constructor(private subjectPolicyCtorDict: SubjectPolicyCtorDict) {}

  create(user: Record<any, any>): Ability {
    const resolvedPolicies = this.resolvePolicies();

    return new Ability(user, resolvedPolicies);
  }

  private resolvePolicies(): SubjectPolicyDict {
    const resolvedPolicies: SubjectPolicyDict = {};

    for (const subjectName in this.subjectPolicyCtorDict) {
      const ctor = this.subjectPolicyCtorDict[subjectName];

      resolvedPolicies[subjectName] = new ctor();
    }

    return resolvedPolicies;
  }
}

export interface SubjectPolicyCtorDict {
  [key: string]: Ctor;
}
