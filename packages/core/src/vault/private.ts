export type PatternMatcher =
  | RegExp
  | string
  | ((key: string, value: unknown) => boolean);

export interface PatternConfig {
  /**
   * Custom pattern to detect sensitive data
   *
   * @default
   * (address|addr|street|location|ward|district|house_number|shipping_to|billing_to), /^(phone|telephone|mobile|contact_number|cellphone), /^(email|mail|user_email), /^(password|secret|token|api_key|private_key|pin|passcode|id_card), /^(bank_account|credit_card|card_number|cvv)
   */
  patterns?: PatternMatcher[];

  /**
   * Custom token prefix display for LLM
   *
   * @default "MASK"
   */
  customPrefix?: string;
}

export class PrivacyVault {
  private tokenMap = new Map<string, unknown>();
  private reverseMap = new Map<string, string>();
  private counter = 0;

  private static readonly DEFAULT_PATTERNS: PatternMatcher[] = [
    /^(address|addr|street|location|ward|district|house_number|shipping_to|billing_to)$/i,
    /^(phone|telephone|mobile|contact_number|cellphone)$/i,
    /^(email|mail|user_email)$/i,
    /^(password|secret|token|api_key|private_key|pin|passcode|id_card)$/i,
    /^(bank_account|credit_card|card_number|cvv)$/i,
  ];

  private mergedPatterns: PatternMatcher[];
  private tokenPrefix: string;

  constructor(customConfig?: PatternConfig) {
    this.tokenPrefix = customConfig?.customPrefix ?? "MASKED";

    this.mergedPatterns = [
      ...PrivacyVault.DEFAULT_PATTERNS,
      ...(customConfig?.patterns ?? []),
    ];
  }

  private isMatch(
    key: string,
    value: unknown,
    matcher: PatternMatcher,
  ): boolean {
    if (matcher instanceof RegExp) {
      return matcher.test(key);
    }

    if (typeof matcher === "string") {
      return key.toLowerCase() === matcher.toLowerCase();
    }

    if (typeof matcher === "function") {
      return matcher(key, value);
    }

    return false;
  }

  private isSensitive(key: string, value: unknown): boolean {
    return this.mergedPatterns.some((matcher) =>
      this.isMatch(key, value, matcher),
    );
  }

  private tokenize(value: unknown): string {
    if (value === null || value === undefined) return value as any;
    const strVal =
      typeof value === "object" ? JSON.stringify(value) : String(value);

    if (this.reverseMap.has(strVal)) {
      return this.reverseMap.get(strVal)!;
    }

    this.counter++;
    const token = `<${this.tokenPrefix.toUpperCase()}_${this.counter}>`;

    this.tokenMap.set(token, value);
    this.reverseMap.set(strVal, token);
    return token;
  }

  public mask<T>(data: T): T {
    if (data === null || data === undefined) return data;

    if (Array.isArray(data)) {
      return data.map((item) => this.mask(item)) as unknown as T;
    }

    if (typeof data === "object") {
      const result: Record<string, unknown> = {};

      for (const [key, value] of Object.entries(data)) {
        if (this.isSensitive(key, value)) {
          result[key] = this.tokenize(value);
        } else if (typeof value === "object" && value !== null) {
          result[key] = this.mask(value);
        } else {
          result[key] = value;
        }
      }

      return result as T;
    }

    return data;
  }

  public unmask(textOrObj: unknown): unknown {
    if (typeof textOrObj === "string") {
      let result = textOrObj;
      for (const [token, rawValue] of this.tokenMap.entries()) {
        const replacement =
          typeof rawValue === "object"
            ? JSON.stringify(rawValue)
            : String(rawValue);
        result = result.replaceAll(token, replacement);
      }
      return result;
    }

    if (Array.isArray(textOrObj)) {
      return textOrObj.map((item) => this.unmask(item));
    }

    if (typeof textOrObj === "object" && textOrObj !== null) {
      const result: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(textOrObj)) {
        result[k] = this.unmask(v);
      }
      return result;
    }

    return textOrObj;
  }
}
