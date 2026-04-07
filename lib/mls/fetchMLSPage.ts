import axios from "axios";

type FetchMLSPageParams = {
  top: number;
  skip: number;
  lastSync: string;
};

export async function fetchMLSPage({
  top,
  skip,
  lastSync,
}: FetchMLSPageParams) {
  // 🔥 HARD GUARD (THIS FIXES YOUR BUG)
  const safeSkip = isNaN(skip) ? 0 : Number(skip);

  if (isNaN(skip)) {
    console.error("❌ skip was NaN — forcing to 0");
  }

  const url = `${process.env.MLS_GRID_BASE_URL}/Property`;

  const response = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${process.env.MLS_GRID_TOKEN}`,
    },
    params: {
      $top: top,
      $skip: safeSkip,
      $filter: `ModificationTimestamp gt ${lastSync}`,
    },
  });

  return response.data?.value || [];
}