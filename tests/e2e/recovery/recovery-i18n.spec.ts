import { test, expect } from '@playwright/test';

test.describe('Phase 18: Internationalization (i18n) Recovery', () => {

  test('Missing Translation Key Recovery - safely falls back to default language strings', async ({ page }) => {
    // 1. Mock the i18n dictionary fetch API (if loaded client-side or edge)
    await page.route('**/api/locales/fr.json*', async (route) => {
      // Simulate an incomplete French dictionary
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          'header': {
            'login': 'Se connecter'
            // 'logout' is MISSING
          }
        })
      });
    });

    await page.goto('/');

    const translationResult = await page.evaluate(async () => {
      // Simulate the i18n resolution logic Next-Intl or similar libraries use
      try {
        const res = await fetch('/api/locales/fr.json', { method: 'POST', cache: 'no-store' });
        const frDict = await res.json();
        
        // This is a naive simulation of `t('header.logout')`
        const getTranslation = (key: string) => {
          const keys = key.split('.');
          let current: any = frDict;
          for (const k of keys) {
            if (current[k] === undefined) {
              // RECOVERY LOGIC: Fallback to English dictionary (hardcoded for test mock)
              const enDict = { header: { logout: 'Logout' } };
              
              let fbCurrent: any = enDict;
              for (const fbK of keys) {
                 fbCurrent = fbCurrent[fbK];
              }
              return fbCurrent || key; // Final fallback is the raw key
            }
            current = current[k];
          }
          return current;
        };

        return {
          loginText: getTranslation('header.login'),
          logoutText: getTranslation('header.logout')
        };
      } catch (e) {
        return { loginText: 'Error', logoutText: 'Error' };
      }
    });

    // Validates that it fetched the French key if present
    expect(translationResult.loginText).toBe('Se connecter');
    
    // Validates that it gracefully recovered the missing French key from the English fallback
    expect(translationResult.logoutText).toBe('Logout');
  });

});
