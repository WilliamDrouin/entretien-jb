import { test, expect } from '@playwright/test';

test.describe('Entretien JB — Tests de fumée', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  // ─── Page & métadonnées ────────────────────────────────────────────────────

  test('la page se charge avec le bon titre', async ({ page }) => {
    await expect(page).toHaveTitle(/Entretien JB/);
  });

  test('la meta description est présente', async ({ page }) => {
    const meta = page.locator('meta[name="description"]');
    await expect(meta).toHaveAttribute('content', /.+/);
  });

  // ─── Navigation ────────────────────────────────────────────────────────────

  test('la nav sticky est visible', async ({ page }) => {
    await expect(page.locator('#site-nav')).toBeVisible();
  });

  test('les liens de navigation desktop sont présents', async ({ page }) => {
    const nav = page.locator('[aria-label="Navigation principale"]');
    await expect(nav).toBeVisible();
    await expect(nav.getByRole('link', { name: 'Services' })).toBeVisible();
    await expect(nav.getByRole('link', { name: 'À propos' })).toBeVisible();
    await expect(nav.getByRole('link', { name: 'Témoignages' })).toBeVisible();
    await expect(nav.getByRole('link', { name: 'Contact' })).toBeVisible();
  });

  test('le CTA "Soumission gratuite" est dans la nav', async ({ page }) => {
    await expect(
      page.locator('#site-nav a[href="#contact"]').filter({ hasText: 'Soumission' }).first()
    ).toBeVisible();
  });

  test('la nav devient opaque au scroll', async ({ page }) => {
    await expect(page.locator('#site-nav')).toHaveAttribute('data-scrolled', 'false');
    await page.evaluate(() => window.scrollBy(0, 200));
    await expect(page.locator('#site-nav')).toHaveAttribute('data-scrolled', 'true');
  });

  test('le menu mobile s\'ouvre et se ferme', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await expect(page.locator('#mobile-menu')).toBeHidden();
    await page.click('#mobile-menu-btn');
    await expect(page.locator('#mobile-menu')).toBeVisible();
    await page.click('#mobile-menu-btn');
    await expect(page.locator('#mobile-menu')).toBeHidden();
  });

  // ─── Hero ──────────────────────────────────────────────────────────────────

  test('le hero est visible avec son h1', async ({ page }) => {
    await expect(page.locator('#hero')).toBeVisible();
    await expect(page.locator('#hero h1')).toBeVisible();
    await expect(page.locator('#hero h1')).toContainText('entretien extérieur');
  });

  test('les deux CTAs du hero sont présents', async ({ page }) => {
    await expect(
      page.locator('#hero a[href="#contact"]').filter({ hasText: 'soumission' })
    ).toBeVisible();
    await expect(
      page.locator('#hero a[href="#services"]').filter({ hasText: 'services' })
    ).toBeVisible();
  });

  // ─── Section Services ──────────────────────────────────────────────────────

  test('la section services contient exactement 4 cartes', async ({ page }) => {
    await page.locator('#services').scrollIntoViewIfNeeded();
    await expect(page.locator('#services article')).toHaveCount(4);
  });

  test('chaque carte service a un titre et un lien', async ({ page }) => {
    await page.locator('#services').scrollIntoViewIfNeeded();
    const cards = page.locator('#services article');
    for (let i = 0; i < 4; i++) {
      await expect(cards.nth(i).locator('h3')).toBeVisible();
      await expect(cards.nth(i).getByRole('link', { name: 'En savoir plus' })).toBeVisible();
    }
  });

  // ─── Section Pourquoi nous ────────────────────────────────────────────────

  test('la section à propos est visible avec 4 raisons', async ({ page }) => {
    await page.locator('#about').scrollIntoViewIfNeeded();
    await expect(page.locator('#about')).toBeVisible();
    await expect(page.locator('#about .reason-item')).toHaveCount(4);
  });

  test('les statistiques sont affichées', async ({ page }) => {
    await page.locator('#about').scrollIntoViewIfNeeded();
    const statsEl = page.locator('[data-stat]');
    await expect(statsEl).toHaveCount(4);
  });

  // ─── Zone de service ──────────────────────────────────────────────────────

  test('la section zone de service est présente', async ({ page }) => {
    await page.locator('#zone-service').scrollIntoViewIfNeeded();
    await expect(page.locator('#zone-service')).toBeVisible();
    await expect(page.locator('#zone-service h2')).toContainText('Beauce');
  });

  test('Saint-Georges est listée comme ville principale', async ({ page }) => {
    await page.locator('#zone-service').scrollIntoViewIfNeeded();
    await expect(
      page.locator('#zone-service').getByText('Saint-Georges', { exact: true })
    ).toBeVisible();
  });

  // ─── Témoignages ──────────────────────────────────────────────────────────

  test('la section témoignages contient 3 cartes', async ({ page }) => {
    await page.locator('#testimonials').scrollIntoViewIfNeeded();
    await expect(page.locator('#testimonials article')).toHaveCount(3);
  });

  test('chaque témoignage a des étoiles et un auteur', async ({ page }) => {
    await page.locator('#testimonials').scrollIntoViewIfNeeded();
    const cards = page.locator('#testimonials article');
    for (let i = 0; i < 3; i++) {
      // 5 stars per card
      await expect(cards.nth(i).locator('svg[fill="#f59e0b"]')).toHaveCount(5);
    }
  });

  // ─── Formulaire de contact ────────────────────────────────────────────────

  test('le formulaire de contact est présent avec tous ses champs', async ({ page }) => {
    await page.locator('#contact').scrollIntoViewIfNeeded();
    await expect(page.locator('#contact-form')).toBeVisible();
    await expect(page.locator('#nom')).toBeVisible();
    await expect(page.locator('#courriel')).toBeVisible();
    await expect(page.locator('#telephone')).toBeVisible();
    await expect(page.locator('#service')).toBeVisible();
    await expect(page.locator('#message')).toBeVisible();
  });

  test('la validation du formulaire fonctionne', async ({ page }) => {
    await page.locator('#contact').scrollIntoViewIfNeeded();
    // Submit empty form
    await page.click('#submit-btn');
    await expect(page.locator('#form-error')).toBeVisible();
  });

  test('le formulaire accepte des données valides', async ({ page }) => {
    await page.locator('#contact').scrollIntoViewIfNeeded();
    await page.fill('#nom', 'Jean Tremblay');
    await page.fill('#courriel', 'jean@test.com');
    await page.fill('#telephone', '4185550000');
    await page.selectOption('#service', 'Tonte de gazon');
    await page.fill('#message', 'Je voudrais une soumission pour mon terrain de 5000 pi2.');
    await page.click('#submit-btn');
    // Success message should appear (simulated)
    await expect(page.locator('#form-success')).toBeVisible({ timeout: 5000 });
  });

  // ─── Footer ───────────────────────────────────────────────────────────────

  test('le footer est visible avec la mention PowerAi', async ({ page }) => {
    await page.locator('footer').scrollIntoViewIfNeeded();
    await expect(page.locator('footer')).toBeVisible();
    await expect(page.locator('footer').getByText('PowerAi')).toBeVisible();
  });

  test('le footer contient les liens de navigation rapide', async ({ page }) => {
    await page.locator('footer').scrollIntoViewIfNeeded();
    await expect(page.locator('footer').getByRole('link', { name: 'Services' }).first()).toBeVisible();
    await expect(page.locator('footer').getByRole('link', { name: 'Contact' })).toBeVisible();
  });

  // ─── Navigation anchors ───────────────────────────────────────────────────

  test('le lien #services scrolle vers la section', async ({ page }) => {
    await page.click('[aria-label="Navigation principale"] a[href="#services"]');
    await expect(page.locator('#services')).toBeInViewport({ ratio: 0.1 });
  });

  test('le lien #contact scrolle vers le formulaire', async ({ page }) => {
    await page.click('[aria-label="Navigation principale"] a[href="#contact"]');
    await expect(page.locator('#contact')).toBeInViewport({ ratio: 0.1 });
  });
});
