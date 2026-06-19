// ShowView Mock Database

const DEFAULT_THEATER_DATA = [
  {
    id: "charlotte",
    name: "샤롯데씨어터",
    currentShow: "뮤지컬 <지킬 앤 하이드>",
    location: "서울 송파구 올림픽로 240",
    totalSeats: "1,241석",
    description: "국내 최초의 뮤지컬 전용 극장으로, 무대와 객석 간의 거리가 매우 가까워 어떤 좌석에서도 뛰어난 몰입감을 선사합니다.",
    bannerImage: "assets/banner_theater.png",
    showPoster: "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?q=80&w=300&auto=format&fit=crop", // placeholder musical poster
    floors: [
      {
        level: 1,
        zones: [
          {
            name: "A구역 (좌)",
            id: "1F-L",
            rows: 10, // Rows A-J
            seatsPerRow: 6,
            defaultClass: "R"
          },
          {
            name: "B구역 (중)",
            id: "1F-C",
            rows: 12, // Rows A-L
            seatsPerRow: 12,
            defaultClass: "VIP"
          },
          {
            name: "C구역 (우)",
            id: "1F-R",
            rows: 10, // Rows A-J
            seatsPerRow: 6,
            defaultClass: "R"
          }
        ]
      },
      {
        level: 2,
        zones: [
          {
            name: "A구역 (좌)",
            id: "2F-L",
            rows: 8, // Rows A-H
            seatsPerRow: 5,
            defaultClass: "S"
          },
          {
            name: "B구역 (중)",
            id: "2F-C",
            rows: 9, // Rows A-I
            seatsPerRow: 10,
            defaultClass: "R"
          },
          {
            name: "C구역 (우)",
            id: "2F-R",
            rows: 8, // Rows A-H
            seatsPerRow: 5,
            defaultClass: "S"
          }
        ]
      }
    ]
  },
  {
    id: "bluesquare",
    name: "블루스퀘어 신한카드홀",
    currentShow: "뮤지컬 <레미제라블>",
    location: "서울 용산구 이태원로 294",
    totalSeats: "1,766석",
    description: "대형 뮤지컬 공연에 최적화된 음향과 무대 설비를 갖춘 국내 대표 복합 문화예술 공간입니다.",
    bannerImage: "assets/banner_theater.png",
    showPoster: "https://images.unsplash.com/photo-1460881680858-30d872d5b530?q=80&w=300&auto=format&fit=crop",
    floors: [
      {
        level: 1,
        zones: [
          {
            name: "왼쪽 블록",
            id: "1F-L",
            rows: 11, // Rows A-K
            seatsPerRow: 7,
            defaultClass: "R"
          },
          {
            name: "중앙 블록",
            id: "1F-C",
            rows: 14, // Rows A-N
            seatsPerRow: 14,
            defaultClass: "VIP"
          },
          {
            name: "오른쪽 블록",
            id: "1F-R",
            rows: 11, // Rows A-K
            seatsPerRow: 7,
            defaultClass: "R"
          }
        ]
      },
      {
        level: 2,
        zones: [
          {
            name: "왼쪽 블록",
            id: "2F-L",
            rows: 8,
            seatsPerRow: 6,
            defaultClass: "S"
          },
          {
            name: "중앙 블록",
            id: "2F-C",
            rows: 10,
            seatsPerRow: 12,
            defaultClass: "R"
          },
          {
            name: "오른쪽 블록",
            id: "2F-R",
            rows: 8,
            seatsPerRow: 6,
            defaultClass: "S"
          }
        ]
      }
    ]
  },
  {
    id: "sejong",
    name: "세종문화회관 대극장",
    currentShow: "뮤지컬 <모차르트!>",
    location: "서울 종로구 세종대로 175",
    totalSeats: "3,022석",
    description: "아시아 최대 규모의 무대 설비를 자랑하며, 웅장하고 압도적인 규모의 대형 클래식 및 뮤지컬 공연이 펼쳐지는 예술의 전당입니다.",
    bannerImage: "assets/banner_theater.png",
    showPoster: "https://images.unsplash.com/photo-1514306191717-452ec28c7814?q=80&w=300&auto=format&fit=crop",
    floors: [
      {
        level: 1,
        zones: [
          {
            name: "좌측 구역",
            id: "1F-L",
            rows: 12,
            seatsPerRow: 8,
            defaultClass: "R"
          },
          {
            name: "중앙 구역",
            id: "1F-C",
            rows: 15,
            seatsPerRow: 16,
            defaultClass: "VIP"
          },
          {
            name: "우측 구역",
            id: "1F-R",
            rows: 12,
            seatsPerRow: 8,
            defaultClass: "R"
          }
        ]
      },
      {
        level: 2,
        zones: [
          {
            name: "좌측 구역",
            id: "2F-L",
            rows: 9,
            seatsPerRow: 7,
            defaultClass: "A"
          },
          {
            name: "중앙 구역",
            id: "2F-C",
            rows: 11,
            seatsPerRow: 14,
            defaultClass: "S"
          },
          {
            name: "우측 구역",
            id: "2F-R",
            rows: 9,
            seatsPerRow: 7,
            defaultClass: "A"
          }
        ]
      }
    ]
  }
];

// Seed reviews for specific seats
const SEED_REVIEWS = {
  // Charlotte Theater reviews
  "charlotte-1-1F-C-3-6": [
    {
      id: "rev1",
      user: "뮤지컬광",
      rating: 5,
      date: "2026-06-10",
      content: "샤롯데 대박 좌석입니다! 1층 3열 중앙이라 무대 배우 표정 연기 눈 깜빡임까지 다 보입니다. 시야 방해 전혀 없고 스피커 소리도 웅장하게 들립니다. 다만 목이 아주 살짝 아플 수 있어요.",
      image: "assets/view_vip.png"
    },
    {
      id: "rev2",
      user: "지킬앤하이드러버",
      rating: 4,
      date: "2026-06-15",
      content: "가까워서 몰입감이 최고예요. 지킬의 변신씬에서 감정이 온전히 전달됩니다. 무대 안쪽 깊숙이 들어가면 발목 아래가 쪼금 가리지만 대체적으로 만족합니다.",
      image: "assets/view_vip.png"
    }
  ],
  "charlotte-1-1F-C-8-6": [
    {
      id: "rev3",
      user: "공연은중앙에서",
      rating: 5,
      date: "2026-05-20",
      content: "개인적으로 샤롯데에서 제일 좋아하는 8열 중앙입니다. 전체적인 연출과 앙상블 군무가 한눈에 잘 보이고, 음향 밸런스도 가장 조화로운 좌석입니다. 무조건 추천!",
      image: "assets/view_r.png"
    }
  ],
  "charlotte-1-1F-L-4-1": [
    {
      id: "rev4",
      user: "티켓팅실패자",
      rating: 2.5,
      date: "2026-06-02",
      content: "왼쪽 극사이드라 왼쪽 구석에서 진행되는 씬은 배우 등짝만 보입니다 ㅠㅠ 주요 장면들은 중앙에서 이뤄져서 보는데 지장은 덜하지만 시야 제한이 확실히 있습니다.",
      image: "assets/view_obstructed.png"
    }
  ],
  "charlotte-2-2F-C-3-5": [
    {
      id: "rev5",
      user: "2층러버",
      rating: 4,
      date: "2026-06-12",
      content: "샤롯데는 2층 3열도 시야가 진짜 쾌적하네요. 1열은 난간 방해 있다고 들어서 3열로 왔는데 난간 전혀 안 걸리고 무대 깊은 곳까지 훤하게 다 보입니다. 망원경 챙기시면 최고!",
      image: "assets/view_s.png"
    }
  ],

  // Blue Square reviews
  "bluesquare-1-1F-C-4-7": [
    {
      id: "rev6",
      user: "레미제덕후",
      rating: 5,
      date: "2026-06-08",
      content: "블루스퀘어 4열 중앙은 무대와 정말 가깝습니다. 음향이 빵빵하고 웅장한 레미제라블 음악이 귀에 직접 꽂힙니다. 오케스트라 피트 때문에 적당한 거리감도 유지되어서 좋습니다.",
      image: "assets/view_vip.png"
    }
  ],
  "bluesquare-1-1F-L-5-1": [
    {
      id: "rev7",
      user: "사이드관람기",
      rating: 3,
      date: "2026-06-11",
      content: "왼쪽 스피커랑 너무 가까워서 귀가 좀 먹먹합니다. 무대 왼쪽 편 구조물에 가려 무대 안쪽 깊은 곳이 종종 안 보여요. 가격 대비 약간 아쉽지만 캐스팅 때문에 봤습니다.",
      image: "assets/view_obstructed.png"
    }
  ],
  "bluesquare-2-2F-C-5-6": [
    {
      id: "rev8",
      user: "가성비추천",
      rating: 3.5,
      date: "2026-05-18",
      content: "무대가 꽤 멀긴 합니다만 전체 동선을 보기에는 정말 시원합니다. 음향도 2층치곤 골고루 퍼지네요. 오페라글라스는 필수 지참하시는 걸 추천합니다.",
      image: "assets/view_s.png"
    }
  ]
};

// Initialize localStorage with seed data if not present
if (!localStorage.getItem("THEATER_DATA")) {
  localStorage.setItem("THEATER_DATA", JSON.stringify(DEFAULT_THEATER_DATA));
}
if (!localStorage.getItem("SEEYA_REVIEWS")) {
  localStorage.setItem("SEEYA_REVIEWS", JSON.stringify(SEED_REVIEWS));
}

// User helper
if (!localStorage.getItem("LOGGED_IN_USER")) {
  localStorage.setItem("LOGGED_IN_USER", JSON.stringify(null));
}
