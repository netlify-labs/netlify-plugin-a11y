import puppeteer from 'puppeteer'
import type { NetlifyPluginOptions } from '@netlify/build'

export type WCAGLevel = 'WCAG2A' | 'WCAG2AA' | 'WCAG2AAA'

type InputT = {
	checkPaths?: string[],
	ignoreDirectories?: string[],
	ignoreElements?: string,
	ignoreGuidelines?: string[],
	failWithIssues?: boolean,
	wcagLevel?: WCAGLevel,
	timeout?: number,
}

const DEFAULT_CHECK_PATHS = ['/']
const DEFAULT_FAIL_WITH_ISSUES = true
const DEFAULT_IGNORE_DIRECTORIES: string[] = []
const DEFAULT_TIMEOUT: number = 60000

const PA11Y_DEFAULT_WCAG_LEVEL = 'WCAG2AA'
const PA11Y_RUNNERS = ['axe']
const PA11Y_USER_AGENT = 'netlify-plugin-a11y'

export const getConfiguration = async ({
	constants: { PUBLISH_DIR },
	inputs,
}: Pick<NetlifyPluginOptions, 'constants' | 'inputs'>) => {
	const { checkPaths, ignoreDirectories, ignoreElements, ignoreGuidelines, failWithIssues, wcagLevel, timeout } =
		inputs as InputT
	return {
		checkPaths: checkPaths || DEFAULT_CHECK_PATHS,
		failWithIssues: failWithIssues ?? DEFAULT_FAIL_WITH_ISSUES,
		ignoreDirectories: ignoreDirectories || DEFAULT_IGNORE_DIRECTORIES,
		pa11yOpts: await getPa11yOpts({
			hideElements: ignoreElements,
			ignore: ignoreGuidelines,
			standard: wcagLevel || PA11Y_DEFAULT_WCAG_LEVEL,
			timeout: timeout || DEFAULT_TIMEOUT,
		}),
		publishDir: (PUBLISH_DIR || process.env.PUBLISH_DIR) as string,
	}
}

export type Config = ReturnType<typeof getConfiguration>

export const getPa11yOpts = async ({ hideElements, ignore, standard, timeout }: { hideElements?: string; ignore?: string[]; standard: WCAGLevel, timeout: number }) => {
	return {
		browser: await puppeteer.launch({ ignoreHTTPSErrors: true }),
		hideElements,
		ignore,
		runners: PA11Y_RUNNERS,
		userAgent: PA11Y_USER_AGENT,
		standard,
		timeout,
	}
}

export type Pa11yOpts = Awaited<ReturnType<typeof getPa11yOpts>>
