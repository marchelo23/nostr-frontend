const styles = {
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '24px',
  },
  card: {
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--border-secondary)',
    borderRadius: '8px',
    padding: '24px',
  },
  cardTitle: {
    fontSize: '18px',
    fontWeight: '600',
    marginBottom: '16px',
  },
  text: {
    color: 'var(--text-tertiary)',
  },
};

export default function Settings() {
  return (
    <div style={{ padding: '24px' }}>
      <h2 style={styles.title}>Settings</h2>
      <div style={styles.card}>
        <h3 style={styles.cardTitle}>Account Settings</h3>
        <p style={styles.text}>
          Settings page coming soon...
        </p>
      </div>
    </div>
  );
}

// Made with Bob
