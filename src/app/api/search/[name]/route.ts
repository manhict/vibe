import { searchSongResult } from "@/lib/types";
import { ytmusic } from "@/lib/ytMusic";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  params: { params: { name: string } }
) {
  try {
    await ytmusic.initialize({
      cookies:
        "PREF=repeat=NONE;_gcl_au=1.1.1502659297.1728791448;VISITOR_INFO1_LIVE=NvNH48Rg2dE;VISITOR_PRIVACY_METADATA=CgJJThIEGgAgJA%3D%3D;SID=g.a000pAjgpC5OLyBj_WRThEHIlSCLyo1_cfXaS4CxR5V-2e_7GMNxSqBMkm08kf1VBfhz0oWFdwACgYKAeUSARESFQHGX2MiX2A5wa306xwZRRqKWeR95xoVAUF8yKrXhQnwjwW1yeK6JH7hn_zP0076;__Secure-1PSIDTS=sidts-CjEBQlrA-AfNtmBU1WHWaqZfJNckd8rxZyaFsLNa_LZ4HdeLBXytL5wxirXHTcddbCGDEAA;__Secure-3PSIDTS=sidts-CjEBQlrA-AfNtmBU1WHWaqZfJNckd8rxZyaFsLNa_LZ4HdeLBXytL5wxirXHTcddbCGDEAA;__Secure-1PSID=g.a000pAjgpC5OLyBj_WRThEHIlSCLyo1_cfXaS4CxR5V-2e_7GMNxQR6mZJFjU9VYL_uPwwKDgQACgYKAcUSARESFQHGX2MiXkI4ZDbt1mw0cML9JKjjaBoVAUF8yKpN6UAh6HP-a7E8jpkLrtrA0076;__Secure-3PSID=g.a000pAjgpC5OLyBj_WRThEHIlSCLyo1_cfXaS4CxR5V-2e_7GMNxq_T7RUVsba8jidmwOyMgrAACgYKAc0SARESFQHGX2Miy3KRcXgE3o30tQcIxf23kRoVAUF8yKqWRd2WZF8S9WTB090cW8W30076;HSID=Ap58esUUGDqurtplt;SSID=AbOJcug75NdgCPRM6;APISID=hTeFiMgsIEti7tpW/A_E4CTOLSBUA7Tge9;SAPISID=t2lk19bSPiFld9ij/AMvC-vxOFVBM0WNC9;__Secure-1PAPISID=t2lk19bSPiFld9ij/AMvC-vxOFVBM0WNC9;__Secure-3PAPISID=t2lk19bSPiFld9ij/AMvC-vxOFVBM0WNC9;LOGIN_INFO=AFmmF2swRQIhANxQlVHPEEW163SUK9egc-t4eDKGvG3wPVaJzLBihyA9AiBtTvMwSytwJwKgNeWdvKETppY6iZF2dvDBNCIa8A_myA:QUQ3MjNmeHVJUHpxLVR5SkZ5eTZGeTI0MlVUV0NxOVJ0X3lqR0VDNU9vLUEyMlFBODdBSGlabElEQ3VCT0tpNUhvaGMyYkVwQUUzTE9jM0xLMDdzdjZQR0JJT2JSVUxKeGxGOHRCVU4tVm5fRi1iRDNSZnlHVHBUdEtPSlRweHNtVEdFLXdnMzZOaUlJUHA5TmpSTFkwYm5YVnFINDczMkZn;SIDCC=AKEyXzUln97KPo7UiauklK6dMQp0uudvpasoDTa3mlz0CNRrq5n9XoERryZu51dgzxg6yQjrqQ;__Secure-1PSIDCC=AKEyXzVoClqETH0HON__u2cUBjRE1mDRtL_CF-dOSz2zwSDMkRD0GIjP6Q2eeojKQSCBX5kJ_A;__Secure-3PSIDCC=AKEyXzVjpkqeMnttwL-eStnvtfKJW713yfGzc-t3sC_056Lv1nT0C3EbFdXcqpnQ50UsdxgP",
    });

    const page = req.nextUrl.searchParams.get("page");

    const [data, ytSongs] = await Promise.all([
      await fetch(
        `${process.env.BACKEND_URI}/api/search/songs?query=${
          params.params.name
        }&page=${page || 0}`,
        {
          next: { revalidate: Infinity },
        }
      ),
      await ytmusic.searchSongs(params.params.name),
    ]);

    const songs = ytSongs.map((s) => ({
      id: s.videoId,
      name: s.name,
      artists: {
        primary: [
          {
            id: s.artist.artistId,
            name: s.artist.name,
            role: "",
            image: [],
            type: "artist",
            url: "",
          },
        ],
      },
      image: [
        {
          quality: "500x500",
          url: `https://wsrv.nl/?url=${s.thumbnails[
            s.thumbnails.length - 1
          ].url.replace(/w\d+-h\d+/, "w500-h500")}`,
        },
      ],
      source: "youtube",
      downloadUrl: [
        {
          quality: "320kbps",
          url: `https://sstream.onrender.com/stream/${s.videoId}`,
        },
      ],
    }));

    if (data.ok) {
      const result = (await data.json()) as searchSongResult;
      return NextResponse.json(
        {
          data: { ...result.data, results: [...songs, ...result.data.results] },
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json({ message: "Failed to fetch" }, { status: 500 });
    }
  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to fetch", error: error.message },
      { status: 500 }
    );
  }
}
