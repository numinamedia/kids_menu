import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { menuCategories as localMenuCategories } from '../data/menuData';

/**
 * Hook to fetch menu items from Supabase.
 * Falls back to local menuData.js if Supabase is not configured or fails.
 */
export function useMenu() {
  const [menuCategories, setMenuCategories] = useState(localMenuCategories);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function fetchMenu() {
      if (!import.meta.env.VITE_SUPABASE_URL) {
        // Supabase not configured, use local data
        return;
      }

      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('menu_items')
          .select('*')
          .eq('is_available', true)
          .order('sort_order', { ascending: true });

        if (error) throw error;

        if (mounted && data && data.length > 0) {
          // Transform Supabase data to match local structure
          const categories = {};
          data.forEach(item => {
            if (!categories[item.category]) {
              categories[item.category] = {
                id: item.category,
                title: getCategoryTitle(item.category),
                items: [],
              };
            }
            categories[item.category].items.push({
              id: item.id,
              name: item.name,
              icon: item.icon || '🍽️',
              bgColor: item.bg_color || '#ffeaa7',
            });
          });
          setMenuCategories(Object.values(categories));
        }
      } catch (err) {
        console.warn('Failed to fetch menu from Supabase, using local data:', err.message);
        // Keep local fallback data
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    fetchMenu();

    return () => { mounted = false; };
  }, []);

  return { menuCategories, loading, error };
}

/**
 * Hook to submit orders to Supabase.
 */
export function useSubmitOrder() {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const submitOrder = async (kidName, selectedItems, notes) => {
    setSubmitting(true);
    setError(null);

    try {
      if (!import.meta.env.VITE_SUPABASE_URL) {
        // Fallback to Google Sheets if Supabase not configured
        throw new Error('SUPABASE_NOT_CONFIGURED');
      }

      const orderData = {
        kid_name: kidName,
        items: selectedItems,
        notes: notes,
        status: 'pending',
        timestamp: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('orders')
        .insert([orderData])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setSubmitting(false);
    }
  };

  return { submitOrder, submitting, error };
}

function getCategoryTitle(categoryId) {
  const titles = {
    mains: 'Main Dishes 🍱',
    sides: 'Sides 🥦',
    desserts: 'Desserts 🍦',
    snacks: 'Snacks 🍿',
    drinks: 'Drinks 💧',
  };
  return titles[categoryId] || categoryId;
}