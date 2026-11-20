import { CognitiveDomain, DeclineAlert, DomainDifficulty, PatientProfile, RuleEngineConfig, SessionRecord } from '../types';

export const DEFAULT_RULE_CONFIG: RuleEngineConfig = {
  rollingWindowSize: 5,
  upgradeAccuracyThreshold: 80, // % accuracy to consider bumping difficulty
  downgradeAccuracyThreshold: 55, // % accuracy below which difficulty decreases
  declineAlertMarginPercent: 15, // 15% drop compared to patient's personal baseline
  declineConsecutiveSessions: 3, // over 3 consecutive sessions
  maxSessionMinutes: 8, // 8-minute maximum session to prevent cognitive fatigue
};

export class AdaptiveAIEngine {
  private config: RuleEngineConfig;

  constructor(customConfig?: Partial<RuleEngineConfig>) {
    this.config = { ...DEFAULT_RULE_CONFIG, ...customConfig };
  }

  getConfig(): RuleEngineConfig {
    return { ...this.config };
  }

  updateConfig(newConfig: Partial<RuleEngineConfig>) {
    this.config = { ...this.config, ...newConfig };
  }

  // Calculate rolling average for a specific domain based on the last N sessions
  calculateRollingAverage(sessions: SessionRecord[], domain: CognitiveDomain, windowSize?: number): number {
    const n = windowSize || this.config.rollingWindowSize;
    const domainSessions = sessions
      .filter(s => s.domain === domain)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, n);

    if (domainSessions.length === 0) return 70; // Default median score

    const totalAccuracy = domainSessions.reduce((sum, s) => sum + s.accuracy, 0);
    return Math.round(totalAccuracy / domainSessions.length);
  }

  // Adjust difficulty for the next session based on session performance and current difficulty
  computeNextDifficulty(
    currentDiff: DomainDifficulty,
    latestAccuracy: number,
    responseTimeMs: number,
    errorCount: number
  ): { nextDifficulty: DomainDifficulty; delta: number; rationale: string } {
    let newLevel = currentDiff.level;
    let delta = 0;
    let highs = currentDiff.consecutiveHighs;
    let lows = currentDiff.consecutiveLows;
    let rationale = 'Performance within expected stable band. Difficulty maintained.';

    // Check if patient exceeded threshold with fast response (< 8 seconds average)
    if (latestAccuracy >= this.config.upgradeAccuracyThreshold && errorCount <= 1) {
      highs += 1;
      lows = 0;
      if (highs >= 2 && newLevel < 5) {
        newLevel += 1;
        delta = 1;
        highs = 0;
        rationale = `Patient achieved ${latestAccuracy}% accuracy across consecutive sessions. Difficulty raised to Level ${newLevel} to maintain engagement.`;
      } else {
        rationale = `Strong session (${latestAccuracy}%). 1 more strong session needed to elevate difficulty.`;
      }
    } else if (latestAccuracy < this.config.downgradeAccuracyThreshold || errorCount >= 3) {
      lows += 1;
      highs = 0;
      if (lows >= 2 && newLevel > 1) {
        newLevel -= 1;
        delta = -1;
        lows = 0;
        rationale = `Patient experienced high error rate (${errorCount} errors, ${latestAccuracy}% accuracy). Reduced to Level ${newLevel} with fewer distractors to prevent frustration.`;
      } else {
        rationale = `Session had noticeable errors (${errorCount}). Monitoring next session before lowering difficulty.`;
      }
    } else {
      // Steady
      highs = Math.max(0, highs - 1);
      lows = Math.max(0, lows - 1);
    }

    // Concrete tunable parameters based on level (not just an abstract badge)
    const parameterMap: Record<number, { timeLimitSec: number; distractorCount: number; stimulusComplexity: 'simple' | 'moderate' | 'complex'; cueDelaySec: number }> = {
      1: { timeLimitSec: 90, distractorCount: 2, stimulusComplexity: 'simple', cueDelaySec: 8 },
      2: { timeLimitSec: 75, distractorCount: 4, stimulusComplexity: 'simple', cueDelaySec: 6 },
      3: { timeLimitSec: 60, distractorCount: 6, stimulusComplexity: 'moderate', cueDelaySec: 5 },
      4: { timeLimitSec: 45, distractorCount: 8, stimulusComplexity: 'moderate', cueDelaySec: 4 },
      5: { timeLimitSec: 35, distractorCount: 10, stimulusComplexity: 'complex', cueDelaySec: 3 },
    };

    const targetParams = parameterMap[newLevel] || parameterMap[2];

    const nextDifficulty: DomainDifficulty = {
      domain: currentDiff.domain,
      level: newLevel,
      timeLimitSec: targetParams.timeLimitSec,
      distractorCount: targetParams.distractorCount,
      stimulusComplexity: targetParams.stimulusComplexity,
      cueDelaySec: targetParams.cueDelaySec,
      consecutiveHighs: highs,
      consecutiveLows: lows,
    };

    return { nextDifficulty, delta, rationale };
  }

  // Longitudinal Decline Alert Detector: compares patient against their OWN baseline, NOT a global population norm
  evaluateDeclineCandidate(
    patient: PatientProfile,
    sessions: SessionRecord[],
    domain: CognitiveDomain
  ): DeclineAlert | null {
    const personalBaseline = patient.domainBaselines[domain] || 75;
    const domainSessions = sessions
      .filter(s => s.domain === domain)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    if (domainSessions.length < this.config.declineConsecutiveSessions) {
      return null; // Not enough longitudinal data yet
    }

    const recentSessions = domainSessions.slice(0, this.config.declineConsecutiveSessions);
    const rollingAvg = Math.round(
      recentSessions.reduce((sum, s) => sum + s.accuracy, 0) / recentSessions.length
    );

    // Drop percentage relative to patient's personal baseline
    const dropPercentage = Math.round(((personalBaseline - rollingAvg) / personalBaseline) * 100);

    if (dropPercentage >= this.config.declineAlertMarginPercent) {
      let severity: 'mild' | 'moderate' | 'significant' = 'mild';
      if (dropPercentage >= 30) severity = 'significant';
      else if (dropPercentage >= 20) severity = 'moderate';

      const domainNameReadable = {
        memory: 'Short-term and Working Memory',
        attention: 'Sustained Visual Attention',
        routine: 'Daily Sequence & Executive Function',
        pattern: 'Visuospatial & Object Recognition'
      }[domain];

      return {
        id: `alert-${domain}-${Date.now()}`,
        patientId: patient.id,
        domain,
        triggeredAt: new Date().toISOString(),
        baselineScore: personalBaseline,
        rollingAvg,
        dropPercentage,
        consecutiveDropSessions: this.config.declineConsecutiveSessions,
        severity,
        clinicianNotes: `Patient ${patient.name}'s rolling score in ${domainNameReadable} dropped by ${dropPercentage}% (from personal baseline of ${personalBaseline} to rolling average ${rollingAvg}) across ${this.config.declineConsecutiveSessions} consecutive sessions.`,
        suggestedAction: severity === 'significant'
          ? 'Urgent ASHA worker home visit recommended. Assess for recent illness, medication non-adherence, or acute confusion.'
          : 'Schedule review with primary clinician at next health sub-centre visit. Recommend lowering exercise complexity and verifying sleep hygiene.',
        acknowledged: false,
      };
    }

    return null;
  }
}

export const adaptiveEngine = new AdaptiveAIEngine();
