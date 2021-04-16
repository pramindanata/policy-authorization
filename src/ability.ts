import { AnyFunction, Ctor } from './common';

export class Ability {
  constructor(
    private user: Record<any, any>,
    private subjectPolicyDict: SubjectPolicyDict,
  ) {}

  can(action: string, subject: Subject): boolean {
    const subjectName = this.getSubjectName(subject);
    const policy = this.subjectPolicyDict[subjectName];

    if (!policy) {
      throw new PolicyNotFoundException(subjectName);
    }

    const policyMethod = policy[action] as AnyFunction<boolean>;

    if (!policyMethod) {
      throw new ActionNotFoundException(action);
    }

    const preCheckMethod = policy['before'] as AnyFunction<boolean> | undefined;

    if (preCheckMethod) {
      const isSkipped = preCheckMethod.apply(policy, [this.user, action]);

      if (typeof isSkipped === 'boolean') return isSkipped;
    }

    if (typeof subject === 'object') {
      return policyMethod.apply(policy, [this.user, subject]);
    }

    return policyMethod.apply(policy, [this.user]);
  }

  cannot(action: string, subject: Subject): boolean {
    return !this.can(action, subject);
  }

  private getSubjectName(subject: Subject): string {
    if (typeof subject === 'string') {
      return subject;
    }

    if (typeof subject === 'object') {
      return subject.constructor.name;
    }

    return subject.name;
  }
}

export class PolicyNotFoundException extends Error {
  constructor(subject: string) {
    super(`Policy for subject "${subject}" does not found`);
  }
}

export class ActionNotFoundException extends Error {
  constructor(action: string) {
    super(`Action "${action}" does not found`);
  }
}

export interface WithPreCheck<U = any, A = string> {
  before(user: U, action: A): boolean | undefined;
}

export interface SubjectPolicyDict {
  [key: string]: Record<string, any>;
}

export type Subject = Ctor<Record<string, any>> | Record<string, any> | string;
