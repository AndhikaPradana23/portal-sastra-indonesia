async function fetchHomeData({
    table,
    columns,
    orderBy = "created_at",
    ascending = false,
    limit = HOME_CONFIG.LIMIT
}) {
    const { data, error } = await supabaseClient
        .from(table)
        .select(columns)
        .order(orderBy, { ascending })
        .limit(
            APP_CONFIG.HOME_LIMIT
        )

    if (error) throw error;

    return data || [];
}