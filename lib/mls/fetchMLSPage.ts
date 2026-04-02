import axios from 'axios'

export async function fetchMLSPage({ page, pageSize, lastSync }: any) {
  const url = `${process.env.MLS_GRID_BASE_URL}/Property`

  const params: any = {
    $top: pageSize,
    $skip: page * pageSize,
  }

  if (lastSync) {
    params.$filter = `ModificationTimestamp gt ${new Date(lastSync).toISOString()}`
  }

  const res = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${process.env.MLS_GRID_TOKEN}`,
    },
    params,
  })

  return res.data
}