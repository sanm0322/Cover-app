export const styles = {
    root: {
        minHeight: '100vh',
        background: '#ece7da',
        color: '#141414',
        fontFamily: 'Archivo, sans-serif',
        position: 'relative',
    },
    main: {
        maxWidth: 900,
        margin: '0 auto',
        padding: '28px 20px 40px',
        position: 'relative',
        zIndex: 1,
    },
    topBar: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '16px 20px',
        background: '#141414',
        color: '#ece7da',
        position: 'sticky',
        top: 0,
        zIndex: 10,
        borderBottom: '3px solid #c03434',
    },
    brand: { display: 'flex', gap: 12, alignItems: 'center' },
    brandMark: {
        width: 36, height: 36, borderRadius: 6,
        background: '#c03434', color: '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
    },
    brandName: {
        fontFamily: 'Bebas Neue, sans-serif',
        fontSize: 22, letterSpacing: '0.1em', lineHeight: 1,
    },
    brandSub: {
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: 9, color: '#87837b', letterSpacing: '0.12em',
        textTransform: 'uppercase', marginTop: 2,
    },
    iconBtn: {
        width: 34, height: 34, borderRadius: 6,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#ece7da', background: 'rgba(255,255,255,0.06)',
    },
    personaBtn: {
        display: 'flex', gap: 8, alignItems: 'center',
        padding: '5px 10px 5px 5px', borderRadius: 999,
        background: 'rgba(255,255,255,0.08)', color: '#ece7da',
    },
    personaName: {
        fontFamily: 'Archivo, sans-serif', fontWeight: 600,
        fontSize: 12, color: '#ece7da',
    },
    personaRole: {
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: 9, color: '#87837b', letterSpacing: '0.1em', textTransform: 'uppercase',
    },

    heroRow: {
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'flex-end', gap: 20, marginBottom: 20, flexWrap: 'wrap',
    },
    kicker: {
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase',
        color: '#87837b', marginBottom: 6,
    },
    hero: {
        fontFamily: 'Bebas Neue, sans-serif',
        fontSize: 52, letterSpacing: '0.02em', margin: 0,
        lineHeight: 0.95, color: '#141414',
    },
    heroSub: {
        fontFamily: 'Archivo, sans-serif', fontSize: 14,
        color: '#3a3a3a', margin: '8px 0 0', maxWidth: 500,
    },
    bigPostBtn: {
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '14px 22px', background: '#c03434', color: '#fff',
        fontFamily: 'Archivo, sans-serif', fontWeight: 700, fontSize: 14,
        letterSpacing: '0.05em', borderRadius: 6, textTransform: 'uppercase',
        transition: 'background 0.15s',
    },

    statRow: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
        gap: 10, marginBottom: 28,
    },
    statCard: {
        background: '#f5f1e6', border: '1px solid #d9d2bf',
        padding: '14px 16px', borderRadius: 6,
    },
    statValue: {
        fontFamily: 'Bebas Neue, sans-serif',
        fontSize: 38, lineHeight: 0.9, letterSpacing: '0.02em',
    },
    statLabel: {
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase',
        color: '#87837b', marginTop: 6,
    },

    alertBar: {
        display: 'flex', alignItems: 'center', gap: 10,
        background: '#c03434', color: '#fff',
        padding: '10px 14px', borderRadius: 4,
        fontSize: 13, marginBottom: 20,
        fontFamily: 'Archivo, sans-serif',
    },

    filterRow: { display: 'flex', gap: 6, marginBottom: 20, flexWrap: 'wrap' },
    filterBtn: {
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '8px 14px', background: 'transparent',
        border: '1px solid #d9d2bf', borderRadius: 4,
        fontFamily: 'Archivo, sans-serif', fontSize: 12, fontWeight: 600,
        color: '#3a3a3a',
    },
    filterBtnActive: { background: '#141414', color: '#ece7da', borderColor: '#141414' },
    filterCount: {
        fontFamily: 'JetBrains Mono, monospace', fontSize: 10,
        padding: '2px 6px', background: 'rgba(255,255,255,0.1)', borderRadius: 999,
    },

    sectionHeader: {
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', marginBottom: 10,
        paddingBottom: 8, borderBottom: '1px solid #d9d2bf',
    },
    sectionTitleWrap: { display: 'flex', alignItems: 'center', gap: 8, color: '#3a3a3a' },
    sectionTitle: {
        fontFamily: 'Archivo, sans-serif', fontWeight: 700,
        fontSize: 13, letterSpacing: '0.1em', textTransform: 'uppercase',
        margin: 0, color: '#141414',
    },
    sectionCount: {
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: 11, color: '#87837b',
    },

    card: {
        background: '#f5f1e6',
        borderRadius: 4,
        padding: 16,
        display: 'flex', gap: 16, alignItems: 'flex-start',
        transition: 'transform 0.15s, box-shadow 0.15s',
        flexWrap: 'wrap',
    },
    cardMain: { flex: 1, minWidth: 200 },
    cardTop: {
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', gap: 10, marginBottom: 8,
    },
    cardClass: {
        fontFamily: 'Bebas Neue, sans-serif',
        fontSize: 22, letterSpacing: '0.03em', lineHeight: 1,
    },
    statusTag: {
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: 9, letterSpacing: '0.15em',
        padding: '3px 7px', border: '1px solid', borderRadius: 3,
        textTransform: 'uppercase', whiteSpace: 'nowrap',
    },
    cardMeta: {
        display: 'flex', gap: 14, color: '#3a3a3a',
        fontSize: 13, marginBottom: 10, flexWrap: 'wrap',
    },
    metaItem: { display: 'flex', alignItems: 'center', gap: 5 },
    cardPeople: {
        display: 'flex', gap: 10, alignItems: 'center',
        marginBottom: 8, flexWrap: 'wrap',
    },
    personLine: { display: 'flex', gap: 8, alignItems: 'center' },
    personText: { display: 'flex', flexDirection: 'column', lineHeight: 1.15 },
    personLabel: {
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: 9, color: '#87837b', letterSpacing: '0.1em', textTransform: 'uppercase',
    },
    personName: {
        fontFamily: 'Archivo, sans-serif', fontWeight: 600,
        fontSize: 12, color: '#141414',
    },
    cardReason: {
        fontSize: 12, color: '#3a3a3a', marginTop: 6,
        paddingTop: 8, borderTop: '1px dashed #d9d2bf',
        lineHeight: 1.4,
    },
    reasonLabel: {
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: 9, color: '#87837b', letterSpacing: '0.15em', marginRight: 6,
    },
    cardAction: { display: 'flex', alignItems: 'stretch' },
    claimBtn: {
        display: 'flex', alignItems: 'center', gap: 6,
        padding: '10px 16px',
        background: '#141414', color: '#ece7da',
        fontFamily: 'Archivo, sans-serif', fontWeight: 700, fontSize: 11,
        letterSpacing: '0.1em', borderRadius: 4, whiteSpace: 'nowrap',
        transition: 'background 0.15s',
    },
    cancelBtn: {
        display: 'flex', alignItems: 'center', gap: 5,
        padding: '8px 12px', color: '#c03434',
        fontFamily: 'Archivo, sans-serif', fontWeight: 600,
        fontSize: 12, border: '1px solid #c03434', borderRadius: 4,
    },

    emptyState: {
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '16px 4px', color: '#87837b', fontSize: 13,
        fontStyle: 'italic',
    },
    emptyDash: { width: 24, height: 1, background: '#c7bfa8' },

    overlay: {
        position: 'fixed', inset: 0,
        background: 'rgba(20,20,20,0.55)',
        backdropFilter: 'blur(3px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 20, zIndex: 100,
        animation: 'fadeIn 0.15s ease',
    },
    modal: {
        background: '#f5f1e6',
        borderRadius: 6,
        padding: 24, width: '100%', maxHeight: '90vh',
        overflowY: 'auto',
        border: '1px solid #d9d2bf',
        boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
    },
    modalHeader: {
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'flex-start', marginBottom: 12, gap: 16,
    },
    modalTitle: {
        fontFamily: 'Bebas Neue, sans-serif',
        fontSize: 28, letterSpacing: '0.03em', margin: 0,
        color: '#141414',
    },
    modalIntro: {
        fontSize: 13, color: '#3a3a3a',
        marginTop: 0, marginBottom: 18, lineHeight: 1.5,
    },
    closeBtn: {
        width: 32, height: 32, borderRadius: 4,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#3a3a3a', background: 'transparent',
        flexShrink: 0,
    },
    modalActions: {
        display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 16,
    },
    primaryBtn: {
        display: 'flex', alignItems: 'center', gap: 6,
        padding: '11px 18px',
        background: '#141414', color: '#ece7da',
        fontFamily: 'Archivo, sans-serif', fontWeight: 700,
        fontSize: 13, borderRadius: 4,
        letterSpacing: '0.02em',
    },
    secondaryBtn: {
        padding: '11px 18px',
        background: '#ece7da', color: '#141414',
        fontFamily: 'Archivo, sans-serif', fontWeight: 600,
        fontSize: 13, borderRadius: 4,
        border: '1px solid #d9d2bf',
    },
    dangerBtn: {
        display: 'flex', alignItems: 'center', gap: 6,
        padding: '11px 18px',
        background: '#c03434', color: '#fff',
        fontFamily: 'Archivo, sans-serif', fontWeight: 700,
        fontSize: 13, borderRadius: 4,
    },

    formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 },
    field: { display: 'flex', flexDirection: 'column', gap: 5, marginBottom: 12 },
    fieldLabel: {
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase',
        color: '#87837b',
    },
    input: {
        padding: '10px 14px', border: '1px solid #d9d2bf',
        borderRadius: 4, fontSize: 14, background: '#faf7ed',
        color: '#141414', width: '100%',
    },
    entriesList: {
        display: 'flex', flexDirection: 'column', gap: 8,
        marginBottom: 10,
    },
    entryRow: {
        display: 'flex', alignItems: 'flex-start', gap: 8,
        padding: 12,
        background: '#ece7da', border: '1px solid #d9d2bf',
        borderRadius: 4,
    },
    entryIndex: {
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: 10, color: '#87837b', letterSpacing: '0.1em',
        paddingTop: 26, flexShrink: 0, width: 20,
    },
    entryFields: {
        flex: 1,
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(105px, 1fr))',
        gap: 8,
    },
    removeEntryBtn: {
        width: 28, height: 28, borderRadius: 4,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#87837b', background: 'transparent',
        border: '1px solid #d9d2bf',
        marginTop: 22, flexShrink: 0,
    },
    addEntryBtn: {
        display: 'flex', alignItems: 'center', gap: 6,
        padding: '9px 14px',
        background: 'transparent', color: '#141414',
        border: '1px dashed #87837b', borderRadius: 4,
        fontFamily: 'Archivo, sans-serif', fontWeight: 600, fontSize: 12,
        marginBottom: 14, width: '100%', justifyContent: 'center',
    },
    entryPreview: {
        marginTop: 8, fontSize: 11,
        fontFamily: 'JetBrains Mono, monospace',
        color: '#3a3a3a', letterSpacing: '0.02em',
    },
    subShiftList: {
        listStyle: 'none', padding: 0, margin: '10px 0 0',
        borderTop: '1px dashed #d9d2bf',
        paddingTop: 8,
    },
    subShiftRow: {
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '5px 0', fontSize: 12,
        borderBottom: '1px dashed #e9e2ce',
        flexWrap: 'wrap',
    },
    subShiftDot: {
        width: 7, height: 7, borderRadius: '50%', flexShrink: 0,
    },
    subShiftWhen: {
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: 11, color: '#141414', minWidth: 120,
    },
    subShiftClass: { flex: 1, color: '#3a3a3a', fontSize: 12, minWidth: 120 },
    subShiftStatus: {
        fontFamily: 'JetBrains Mono, monospace', fontSize: 10,
        color: '#87837b', letterSpacing: '0.08em',
        textTransform: 'lowercase',
    },

    claimSelectToolbar: {
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', marginBottom: 10,
    },
    claimSelectCount: {
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: 10, color: '#87837b', letterSpacing: '0.15em', textTransform: 'uppercase',
    },
    smallBtn: {
        padding: '6px 10px',
        background: '#ece7da', color: '#141414',
        fontFamily: 'Archivo, sans-serif', fontWeight: 600, fontSize: 11,
        borderRadius: 3, border: '1px solid #d9d2bf',
        letterSpacing: '0.05em',
    },
    claimSelectList: {
        display: 'flex', flexDirection: 'column', gap: 6,
        marginBottom: 16,
    },
    claimSelectRow: {
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '10px 12px',
        background: '#ece7da', border: '1px solid #d9d2bf',
        borderRadius: 4, textAlign: 'left', width: '100%',
        cursor: 'pointer',
        transition: 'background 0.1s, border-color 0.1s',
    },
    claimSelectRowActive: {
        background: '#dfe8df', borderColor: '#1d6b48',
    },
    claimSelectBox: {
        width: 18, height: 18, borderRadius: 3,
        border: '1.5px solid #141414',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: '#faf7ed',
        flexShrink: 0, color: '#1d6b48',
    },
    claimSelectWhen: {
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: 11, color: '#141414', minWidth: 130,
    },
    claimSelectClass: {
        flex: 1, fontFamily: 'Archivo, sans-serif', fontSize: 13, color: '#141414',
    },

    confirmListBox: {
        background: '#ece7da', border: '1px solid #d9d2bf',
        borderRadius: 4, padding: 10, marginBottom: 14,
        display: 'flex', flexDirection: 'column', gap: 4,
        maxHeight: 180, overflowY: 'auto',
    },
    confirmListRow: {
        display: 'flex', gap: 10, alignItems: 'center',
        padding: '5px 2px', fontSize: 12,
        borderBottom: '1px dashed #d9d2bf',
    },
    confirmListWhen: {
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: 11, color: '#141414', minWidth: 130,
    },
    confirmListClass: { flex: 1, fontSize: 12, color: '#3a3a3a' },

    confirmBox: {
        background: '#ece7da', border: '1px solid #d9d2bf',
        borderRadius: 4, padding: 14, marginBottom: 16,
        display: 'flex', flexDirection: 'column', gap: 8,
    },
    confirmRow: {
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', fontSize: 13,
    },

    emailCard: {
        background: '#ece7da', borderRadius: 4,
        padding: 12, border: '1px solid #d9d2bf',
    },
    emailHead: {
        display: 'flex', alignItems: 'center', gap: 8,
        marginBottom: 8, color: '#87837b', flexWrap: 'wrap',
    },
    emailTag: {
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase',
        background: '#141414', color: '#ece7da',
        padding: '2px 6px', borderRadius: 2,
    },
    emailTo: {
        fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: '#3a3a3a',
    },
    emailSubject: {
        fontFamily: 'Archivo, sans-serif', fontWeight: 700,
        fontSize: 13, color: '#141414', marginBottom: 8,
    },
    emailBody: {
        fontFamily: 'JetBrains Mono, monospace', fontSize: 11,
        color: '#3a3a3a', margin: 0, whiteSpace: 'pre-wrap',
        lineHeight: 1.55,
    },

    successKicker: {
        display: 'inline-flex', alignItems: 'center', gap: 4,
        fontFamily: 'JetBrains Mono, monospace', fontSize: 10,
        letterSpacing: '0.2em', color: '#1d6b48', marginBottom: 4,
    },

    personaGroup: { marginBottom: 14 },
    personaGroupLabel: {
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: 10, letterSpacing: '0.2em', color: '#87837b',
        marginBottom: 6,
    },
    personaRow: {
        display: 'flex', gap: 10, alignItems: 'center', width: '100%',
        padding: 10, borderRadius: 4,
        transition: 'background 0.1s',
    },
    personaRowActive: { background: '#ece7da' },
    activeDot: {
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: 9, letterSpacing: '0.15em',
        color: '#1d6b48', border: '1px solid #1d6b48',
        padding: '2px 6px', borderRadius: 2,
    },
    dualBadge: {
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: 9, letterSpacing: '0.15em',
        color: '#87837b', border: '1px solid #c7bfa8',
        padding: '2px 6px', borderRadius: 2,
        whiteSpace: 'nowrap',
    },
    viewToggle: {
        display: 'flex', gap: 0,
        background: 'rgba(255,255,255,0.08)',
        borderRadius: 4, padding: 3,
    },
    viewToggleBtn: {
        padding: '6px 10px',
        fontFamily: 'Archivo, sans-serif', fontWeight: 600,
        fontSize: 11, letterSpacing: '0.02em',
        color: '#87837b', borderRadius: 3,
        transition: 'background 0.15s, color 0.15s',
    },
    viewToggleBtnActive: {
        background: '#c03434', color: '#fff',
    },

    // --- View-mode toggle (List / Calendar) ---
    viewModeToggle: {
        display: 'inline-flex', gap: 0,
        background: '#f5f1e6', border: '1px solid #d9d2bf',
        borderRadius: 4, padding: 3, marginBottom: 16,
    },
    viewModeBtn: {
        display: 'flex', alignItems: 'center', gap: 6,
        padding: '7px 14px',
        fontFamily: 'Archivo, sans-serif', fontWeight: 600,
        fontSize: 12, color: '#3a3a3a',
        borderRadius: 3,
        transition: 'background 0.15s, color 0.15s',
    },
    viewModeBtnActive: {
        background: '#141414', color: '#ece7da',
    },

    // --- Calendar ---
    calHeader: {
        display: 'flex', alignItems: 'center', gap: 10,
        marginBottom: 12, flexWrap: 'wrap',
    },
    calTitle: {
        fontFamily: 'Bebas Neue, sans-serif',
        fontSize: 28, letterSpacing: '0.03em',
        color: '#141414', flex: 1,
        lineHeight: 1,
    },
    calNavBtn: {
        width: 34, height: 34, borderRadius: 4,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: '#f5f1e6', border: '1px solid #d9d2bf',
        color: '#141414', fontSize: 20, fontWeight: 600,
        lineHeight: 1,
    },
    calTodayBtn: {
        padding: '7px 12px', borderRadius: 4,
        background: '#141414', color: '#ece7da',
        fontFamily: 'Archivo, sans-serif', fontWeight: 600, fontSize: 11,
        letterSpacing: '0.05em',
    },
    calWeekdayRow: {
        display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)',
        gap: 2, marginBottom: 4,
    },
    calWeekdayLabel: {
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: 10, letterSpacing: '0.15em', color: '#87837b',
        textAlign: 'center', padding: '4px 0',
    },
    calGrid: {
        display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)',
        gap: 2, marginBottom: 20,
    },
    calCell: {
        aspectRatio: '1 / 1',
        minHeight: 48,
        padding: '4px 5px',
        background: '#f5f1e6', border: '1px solid #d9d2bf',
        borderRadius: 3, textAlign: 'left',
        display: 'flex', flexDirection: 'column',
        alignItems: 'flex-start', justifyContent: 'space-between',
        position: 'relative',
        transition: 'background 0.1s, border-color 0.1s',
    },
    calCellOutMonth: {
        opacity: 0.3,
    },
    calCellSelected: {
        background: '#141414', borderColor: '#141414',
    },
    calDayNum: {
        fontFamily: 'Archivo, sans-serif', fontWeight: 700,
        fontSize: 13, color: '#141414',
        lineHeight: 1,
    },
    calDayNumToday: {
        color: '#c03434',
    },
    calDayIndicators: {
        display: 'flex', gap: 3, flexWrap: 'wrap',
        marginTop: 'auto',
    },
    calBadge: {
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: 9, fontWeight: 600,
        padding: '1px 5px', borderRadius: 2,
        lineHeight: 1.3,
    },

    // --- Day details panel below the calendar ---
    dayDetails: {
        background: '#f5f1e6', border: '1px solid #d9d2bf',
        borderRadius: 4, padding: 16, marginBottom: 24,
    },
    dayDetailsHeader: {
        display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
        marginBottom: 12, gap: 10, flexWrap: 'wrap',
        paddingBottom: 10, borderBottom: '1px solid #d9d2bf',
    },
    dayDetailsDate: {
        fontFamily: 'Bebas Neue, sans-serif',
        fontSize: 22, letterSpacing: '0.03em', color: '#141414',
    },
    dayDetailsCount: {
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase',
        color: '#87837b',
    },
    dayDetailsEmpty: {
        display: 'flex', alignItems: 'center', gap: 10,
        color: '#87837b', fontSize: 13, fontStyle: 'italic',
        padding: '8px 0',
    },
    dayShiftList: {
        listStyle: 'none', padding: 0, margin: 0,
        display: 'flex', flexDirection: 'column', gap: 0,
    },
    dayShiftRow: {
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '10px 2px', fontSize: 12,
        borderBottom: '1px dashed #d9d2bf',
        flexWrap: 'wrap',
    },
    dayShiftDot: {
        width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
    },
    dayShiftTime: {
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: 12, color: '#141414',
        minWidth: 50, fontWeight: 500,
    },
    dayShiftClass: {
        fontFamily: 'Archivo, sans-serif', fontWeight: 600,
        fontSize: 13, color: '#141414', minWidth: 120,
    },
    dayShiftPeople: {
        display: 'flex', alignItems: 'center', gap: 6,
        flex: 1, minWidth: 150, color: '#3a3a3a',
    },
    dayShiftName: {
        fontSize: 12, color: '#3a3a3a',
    },
    dayShiftBtnClaim: {
        display: 'flex', alignItems: 'center', gap: 4,
        padding: '6px 12px', background: '#141414', color: '#ece7da',
        fontFamily: 'Archivo, sans-serif', fontWeight: 700, fontSize: 11,
        letterSpacing: '0.05em', borderRadius: 3,
    },
    dayShiftBtnCancel: {
        display: 'flex', alignItems: 'center', gap: 4,
        padding: '6px 10px', background: 'transparent',
        color: '#c03434', border: '1px solid #c03434',
        fontFamily: 'Archivo, sans-serif', fontWeight: 600, fontSize: 11,
        borderRadius: 3,
    },
    dayShiftStatusText: {
        fontFamily: 'JetBrains Mono, monospace', fontSize: 10,
        color: '#87837b', letterSpacing: '0.08em',
    },

    logBox: {
        background: '#f5f1e6', borderRadius: 4,
        border: '1px solid #d9d2bf', padding: 4,
    },
    logRow: {
        display: 'flex', gap: 10, alignItems: 'center',
        padding: '8px 10px', fontSize: 12, color: '#3a3a3a',
        borderBottom: '1px solid #ece7da',
    },
    logTime: {
        fontFamily: 'JetBrains Mono, monospace', fontSize: 10,
        color: '#87837b', width: 62, flexShrink: 0,
    },
    logDot: (type) => ({
        width: 7, height: 7, borderRadius: '50%', flexShrink: 0,
        background: type === 'posted' ? '#c03434' : type === 'claimed' ? '#1d6b48' : '#87837b',
    }),
    logText: { flex: 1, lineHeight: 1.4 },

    footer: {
        maxWidth: 900, margin: '0 auto',
        padding: '20px', display: 'flex',
        justifyContent: 'space-between', alignItems: 'center',
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: 10, color: '#87837b', letterSpacing: '0.1em',
        borderTop: '1px solid #d9d2bf',
    },
    resetBtn: {
        display: 'flex', alignItems: 'center', gap: 5,
        color: '#3a3a3a', fontFamily: 'JetBrains Mono, monospace',
        fontSize: 10, letterSpacing: '0.1em',
    },
};