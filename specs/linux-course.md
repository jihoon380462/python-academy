# 리눅스 교과서 — 설계 (N14 · T9, 2026-11-07 Opus)

> 사용자: 공용 코스 5개 추가(11/6) — 「리눅스는 우분투, 가상 VM 설치 및 적용」 · VM 은 **VirtualBox**. N14 순서는 「**T9 리눅스 먼저**」(11/7).
> 이 문서는 **설계**예요. 만들 때(구현) 이 문서를 그대로 따르고, 바뀌는 건 여기를 먼저 고쳐요. 형식은 `specs/github-course.md` 와 같게.
> 출발점: `TODO.md` 「예정 코스」 T9 칸 · 지금 있는 터미널·Git 교과서(T0~T5 터미널 · T6~T16 Git).

---

## 1. 한 줄로

**내 Windows PC 안에 「망가져도 되는 진짜 우분투」 를 만들고, 그 안에서 리눅스답게 살아 보기.** VirtualBox 로 우분투 26.04 LTS 를 설치하고, 프로그램 설치(apt)·권한·프로세스·서비스·SSH 를 직접 해 봐요. 다 만들고 나면 이 VM 이 **운영체제(T2)·어셈블리어(T10) 교과서의 연습장**이 돼요.

## 2. 다른 교과서와의 경계 (겹침 정리 — 꼭 지킬 것)

| 주제 | 터미널·Git 교과서 (이미 있음) | **리눅스 교과서 (새로)** | 운영체제·어셈블리 (예정) |
| --- | --- | --- | --- |
| pwd·ls·cd·mkdir·cp·mv·rm·cat·less·grep·find·파이프·리다이렉트 | ✅ T0~T5 가 기준(Git Bash) | 다시 가르치지 않음. U5 에서 「Git Bash 와 같은 bash」 를 확인하고 「필요한 문법」 은 터미널 레슨 쪽으로 링크 | — |
| Git | ✅ T6~T16 | 안 다룸(우분투에 `sudo apt install git` 만 — U7) | — |
| 설치·VM·스냅샷·apt·사용자·권한·sudo·PATH·systemd·로그·SSH·cron | — | ✅ 여기가 기준 | 「먼저 꼭」 으로 이 교과서를 가리킴 |
| 프로세스·시그널·메모리·파일 시스템 | — | **보는 법(명령)만**: ps·top·kill·free·df | ✅ T2 가 원리(스케줄링·가상 메모리·inode)를 자세히 |
| gcc·nasm·gdb | — | `build-essential`·`nasm`·`gdb` **설치만**(U7 만들어 보기) | ✅ T10 이 사용법 |

- 원칙: 터미널 교과서는 **「명령 줄 자체」**, 리눅스 교과서는 **「리눅스라는 운영체제를 관리하며 쓰기」**.

## 3. 연습 방법 (교과서 원칙 그대로)

- 연습은 **사용자의 진짜 도구**: Windows 의 **VirtualBox 7.2**(구현 때 최신 7.2.x 확인 — 2026-08 기준 7.2.16) + VM 안의 **Ubuntu Desktop 26.04 LTS**(「Resolute Raccoon」, 2026-04-23 출시 · 2031-04 까지 지원). 사이트 안 가짜 리눅스는 만들지 않아요.
- 화면 이름은 **어느 창 → 어느 탭 → 어느 칸 → 무슨 글자**까지(사용자 선호). VirtualBox 는 영어 화면을 기준으로 하고 괄호 안에 한국어 뜻을 적어요(한국어 화면이면 메뉴 이름이 달라서 둘 다 적기는 너무 길어요). 우분투는 **설치 언어를 한국어**로 해도 터미널 명령은 같아요 → 설치 화면은 한국어 기준.
- 레슨마다 맨 아래 작게 「이 쪽의 화면 이름은 VirtualBox 7.2.x · Ubuntu 26.04 기준(2026-11)」.
- 구현할 때 **virtualbox.org 매뉴얼 · ubuntu.com 문서로 화면 이름을 하나씩 확인**하고, 바뀐 게 있으면 QA 문서에 적어요.

## 4. 「먼저 꼭」 경고 (prereq — 필수 사항 강조)

| 위치 | 제목 | 내용 |
| --- | --- | --- |
| 목차 챕터 1 위 · U1 1쪽 | 먼저 꼭! CPU 가상화가 켜져 있어야 해요 | **작업 관리자(Ctrl+Shift+Esc) → 성능 탭 → CPU → 오른쪽 아래 「가상화: 사용」**. 「사용 안 함」 이면 BIOS/UEFI 의 Intel **VT-x**(Virtualization Technology) / AMD **SVM Mode** 를 켜야 해요(메인보드마다 메뉴 위치가 달라서 「찾는 법」 을 적음) |
| U1 2쪽 | 꼭! VM 창 오른쪽 아래에 🐢 거북이가 보이면 | Windows 의 Hyper-V 계열(메모리 무결성 · 가상 머신 플랫폼 · WSL2 · Windows 샌드박스)이 가상화를 먼저 쥐고 있어서 VirtualBox 가 **아주 느린 모드**로 도는 표시예요. 고치는 법과 **대가**(WSL2·Docker Desktop·샌드박스가 안 됨, 메모리 무결성은 보안 기능) · **되돌리는 법**을 같이(9절 Q2) |
| U2 1쪽 | 디스크 40GB · 메모리 넉넉히 | 우분투 26.04 데스크톱 공식 최소는 **메모리 6GB · 디스크 25GB**(24.04 의 4GB 에서 올라감). VM 에 8GB 를 주려면 PC 메모리가 16GB 이상이어야 편해요 |
| U2 3쪽 | 「디스크를 지우고 설치」 는 **가상 디스크만** | 설치 화면의 「디스크 지우기」 가 지우는 건 VM 안의 빈 가상 디스크(`.vdi` 파일) — Windows 디스크는 안 건드려요. 단 **VM 창 안에서 하는지** 꼭 확인 |
| U4 1쪽 · 챕터 2·3 위 | 위험한 실험 전에는 스냅샷 | 권한·서비스를 만지기 전에 **Machine → Take Snapshot**. 망가지면 Restore 로 1분 만에 원래대로 |
| U8 1쪽 | sudo 는 「관리자로 한 번」 | `sudo rm -rf /`·남이 준 `curl … \| sudo bash` 는 그대로 치지 않기. 비밀번호는 설치 때 정한 것(화면에 안 보이는 게 정상) |
| U13 2쪽 | 포트 포워딩은 내 PC 안에서만 | 호스트 IP 칸을 `127.0.0.1` 로(비워 두면 같은 공유기의 다른 기기도 접속 시도 가능). VirtualBox 는 보안 업데이트가 자주 나오니 최신 7.2.x 로 |

## 5. 목차 (챕터 3 · 레슨 15 + 보스 3)

레슨 id 는 `U0`~`U14`(Ubuntu), 보스 `UB1`~`UB3`. 쪽 수는 2~4쪽(설명 + 예제), 마지막 쪽은 「🛠 만들어 보기」.

### 챕터 1 · 우분투 연습장 만들기

| id | 제목 | 쪽(주요 내용) | 만들어 보기 |
| --- | --- | --- | --- |
| U0 | 리눅스·우분투·가상 머신 | ① 리눅스 = 커널, 우분투 = 배포판(그림: Windows → VirtualBox → Ubuntu 세 겹) · ② 왜 VM 인가(망가져도 됨 · 스냅샷 · 운영체제/어셈블리 연습장) · ③ 이 교과서 쓰는 법(VM 창 ↔ 이 사이트를 나란히) | 내 PC 메모리·디스크 여유 확인(작업 관리자 → 성능 · 설정 → 시스템 → 저장소) — 확인할 것 ☐ |
| U1 | 가상화 켜기와 VirtualBox 설치 | ① 작업 관리자 「가상화: 사용」 확인 · BIOS 메뉴 찾는 법 · ② virtualbox.org → Downloads → **Windows hosts** → 설치 마법사의 칸(네트워크 잠깐 끊김 경고 정상) · ③ 🐢 거북이와 Hyper-V 계열(Q2) | VirtualBox 실행 → **Help → About** 에서 버전 7.2.x 확인 ☐ |
| U2 | VM 만들고 우분투 설치 | ① ubuntu.com → Download → **Ubuntu Desktop 26.04 LTS** ISO(약 6GB) · ② **Machine → New**: Name · ISO Image · ☑ **Skip Unattended Installation**(설치 화면을 직접 보며 배우기 — Q1) · Hardware(Base Memory 8192MB · Processors 4) · Hard Disk 40GB(동적 할당 = 쓴 만큼만 커짐) · ③ 우분투 설치 마법사: 언어 한국어 · 키보드 · 「디스크 지우고 설치」(가상 디스크만) · 사용자 이름·비밀번호 · 재부팅 후 **Devices → Optical Drives** 에서 ISO 빼기 | VM 이 우분투 바탕화면까지 켜짐 ☐ · 로그인 ☐ |
| U3 | 첫 부팅 뒤 할 일 | ① 터미널 열기(**Ctrl+Alt+T**) · `sudo apt update && sudo apt upgrade` · ② 화면 크기·클립보드: **Guest Additions**(Devices → Insert Guest Additions CD image… 또는 우분투 패키지 — 구현 때 26.04 에서 되는 쪽 확인) · **Devices → Shared Clipboard → Bidirectional** · ③ 한글 입력(설정 → 키보드 → 입력 소스 → 한국어(Hangul)) | 창 크기를 바꾸면 우분투 화면도 따라 바뀜 ☐ · Windows 에서 복사한 글이 우분투 터미널에 붙음 ☐ |
| U4 | 스냅샷: 되돌릴 수 있는 연습 | ① 스냅샷 = 그 순간의 사진 · ② **VM 선택 → 오른쪽 Snapshots → Take**(이름 「깨끗한 설치」) · ③ 일부러 파일 하나 지우고 **Restore** 로 되돌리기(꺼진 상태에서) | 「깨끗한 설치」 스냅샷 만들고 되돌리기 한 바퀴 ☐ |
| **UB1** | 🛠 내 우분투 연습장 완성 | 업데이트 끝 · 클립보드 · 한글 · 스냅샷 2개(「깨끗한 설치」·「연습장 완성」) · 터미널에서 `lsb_release -a` 로 26.04 확인 | 확인할 것 ☐ 6개 |

### 챕터 2 · 리눅스답게 쓰기

| id | 제목 | 쪽 | 만들어 보기 |
| --- | --- | --- | --- |
| U5 | 같은 bash, 다른 집 | ① Git Bash 와 같은 것(T0~T5 명령 전부 그대로 — 링크) · ② 다른 것: 드라이브 글자 없음(`/` 하나) · 집은 `/home/이름` · **대소문자 구분** · 줄 끝 LF · ③ `man ls` · `ls --help` · `type`/`which` | 터미널 교과서 TB1 보스를 우분투에서 다시(bash 검사) |
| U6 | 리눅스 폴더 지도 | ① `/` 아래: `home` · `etc`(설정) · `var/log`(기록) · `usr/bin`(프로그램) · `tmp` · `dev` · `proc`(지금 도는 것 — T2 로 이어짐) · ② `ls /etc \| head` · `cat /etc/os-release` · ③ 「모든 게 파일」 맛보기 | `/etc/os-release` 에서 버전 줄만 뽑기(grep — bash 검사) |
| U7 | apt 로 프로그램 설치 | ① 패키지 · 저장소 · `sudo apt update`(목록 새로 받기) vs `upgrade` · ② `apt search` · `install` · `remove` · `apt show` · ③ snap 은 「다른 가게」 정도로 | `tree` · `htop` · `git` · `build-essential` · `nasm` · `gdb` 설치 → 버전 확인(T10 준비) ☐ |
| U8 | 사용자와 권한 | ① `whoami` · `id` · `groups` · ② `ls -l` 의 `-rw-r--r--` 읽기(나·그룹·남 × 읽기·쓰기·실행) · ③ `chmod`(글자 `u+x` · 숫자 `755`) · `chown` · `sudo` 가 하는 일 | 비밀 메모를 나만 읽게 `600` (bash 검사) |
| U9 | 내가 만든 명령 | ① 셸 스크립트 첫 줄 `#!/bin/bash` · `chmod +x` · `./hello.sh` · ② PATH(왜 `./` 가 필요한가) · `~/bin` · `~/.bashrc` 에 `export PATH=…` · ③ `alias ll='ls -alF'` | `~/bin/today` 명령 만들기(bash 검사) |
| **UB2** | 🛠 내 도구 상자 | `~/bin` 에 명령 3개(오늘 날짜 폴더 만들기 · 큰 파일 찾기 · 디스크 여유 보기) + alias 2개 + 스냅샷 「도구 상자」 | bash 검사 + ☐ |

### 챕터 3 · 시스템 들여다보기 (운영체제 교과서 예고편)

| id | 제목 | 쪽 | 만들어 보기 |
| --- | --- | --- | --- |
| U10 | 프로세스 보기와 멈추기 | ① `ps aux` · `htop`(설정 앱 「Resources」 와 같은 정보) · ② `sleep 100 &` · `jobs` · `fg` · **Ctrl+C**(멈춤) vs **Ctrl+Z**(잠깐 세움) · ③ `kill PID` · `kill -9`(마지막 수단) — 시그널 이름만 | 무한 반복 파이썬을 띄우고 찾아서 끄기(bash 검사 가능 부분 + ☐) |
| U11 | 서비스와 로그 | ① 서비스 = 늘 켜져 있는 프로그램 · `systemctl status` · `start`/`stop` · `enable`(부팅 때 자동) · ② `journalctl -u 이름` · `-f`(따라 보기) · `/var/log` · ③ 예: `openssh-server` 설치하고 상태 보기 | ssh 서비스 `active (running)` ☐ |
| U12 | 디스크와 메모리 | ① `df -h`(남은 공간) · `du -sh *`(어디가 큰가) · `free -h` · `lsblk` · ② 가상 디스크가 꽉 차면(스냅샷이 공간을 먹음) · ③ 정리: `sudo apt autoremove` · `journalctl --vacuum-size` | 홈 폴더에서 가장 큰 폴더 3개(bash 검사) |
| U13 | 네트워크와 SSH | ① `ip a` · `ping -c 3` · `curl -I` · ② VirtualBox 네트워크(NAT) · **Settings → Network → Adapter 1 → Port Forwarding**: Host IP `127.0.0.1` · Host Port `2222` · Guest Port `22` · ③ Windows 터미널에서 `ssh -p 2222 이름@127.0.0.1` · ④ **VS Code → Remote - SSH** 로 VM 안 파일을 Windows 의 VS Code 로 고치기(Q4) | Windows 에서 ssh 로 들어가 `hostname` ☐ · VS Code 로 VM 파일 저장 ☐ |
| U14 | 예약 작업 | ① `crontab -e` 의 다섯 칸(분 시 일 월 요일) · ② `tar -czf` 백업 · 출력은 `>> ~/backup.log 2>&1` · ③ 「cron 은 PATH 가 짧다」 함정 | 5분마다 메모 폴더를 백업 ☐ |
| **UB3** | 🛠 스스로 돌아가는 VM | 백업 스크립트(`~/bin`) + cron(매일) + 로그 확인 + 디스크 여유 경고(`df` 가 90% 넘으면 기록) + SSH 로 Windows 에서 결과 확인 | bash 검사 + ☐ |

## 6. 「만들어 보기」 모양과 검사

- 모양은 다른 교과서와 같음: 문장 문제 · **필요한 문법/화면**(실제 명령·실제 메뉴 이름) · 예시 답(명령 목록 또는 단계) · **확인할 것 ☐**.
- **자동 검사가 되는 것** — 파일·권한·스크립트·PATH·grep(U5·U6·U8·U9·U12·UB2·UB3 의 스크립트 부분): 터미널 교과서처럼 `setup` + `answer` + `check` 를 **bash** 로(`check_book`). 우분투 전용이 아닌 명령만 쓰게 골라요(CI 는 ubuntu-latest 라 마침 같은 계열).
- **자동 검사가 안 되는 것** — VirtualBox 화면 · 설치 · apt · systemctl · ssh · cron: `noRun` + **확인할 것 ☐ 필수**(check_book: `BOOK.check = 'linux'` 이면 checks 없는 noRun 문제는 실패).
- 확인할 것은 **사용자가 자기 화면에서 볼 수 있는 것**으로: 「VM 창 오른쪽 아래가 🐢 가 아니라 V 모양」, 「`systemctl status ssh` 의 초록 `active (running)`」, 「`lsb_release -a` 의 `Release: 26.04`」.

## 7. 시작하기 · 도감 · 허브

- **시작하기 3쪽**: ① 준비물(Windows 10/11 64비트 · 메모리 16GB 이상 권장 · 디스크 여유 40GB · 인터넷) ② 터미널 교과서 T0~T5 를 먼저(명령 줄이 처음이면) ③ VM 창과 이 사이트를 나란히 두는 법(Windows 의 화면 분할 **Win+←/→**).
- **도감**: 「리눅스 명령·화면 도감」 — 쪽 제목을 실제 명령/메뉴로(`sudo apt install`, `chmod 755`, `systemctl status`, `Settings → Network → Port Forwarding`). 도구 상자 = 자주 쓰는 명령 20개.
- **허브**: 「공용」 칸(Vim·수학 옆). 카드 「🐧 리눅스 · 📖 교과서 · 읽은 레슨 n/18 · 내 PC 의 VirtualBox 에 우분투」. `CONFIG.COURSES` 에 `book: true`.

## 8. 만들 순서 (구현 계획)

1. `courses/linux/` 뼈대(content.js 의 LESSONS·CHAPTERS · book.js · index.html) + 허브 카드 + check_book `linux` 검사 + regress 절 + **시작하기 + 챕터 1(U0~U4·UB1)** — v2.21.0. 화면 이름은 virtualbox.org 매뉴얼·ubuntu.com 문서로 대조.
2. 챕터 2(U5~U9·UB2) — v2.21.x (bash 자동 검사 중심)
3. 챕터 3(U10~U14·UB3) — v2.22.0
4. 단계마다: 공식 문서 대조 · 폰 390/PC QA · 문서(site-intent 코스 표·TODO·CHANGELOG·HANDOFF).
5. 다 끝나면 TODO 의 T2 운영체제 · T10 어셈블리어 설계에서 「먼저 꼭: 리눅스 교과서 UB1(연습장)」 을 선수 조건으로.

## 9. 정할 것 → **사용자 결정 11/7: Q1~Q4 모두 제안대로**(Q5 이름은 제안 그대로 씀)

| # | 질문 | 결정 |
| --- | --- | --- |
| Q1 | 우분투 설치를 「자동 설치(Unattended)」 로 할까, 설치 화면을 직접 볼까? | ✅ **직접**(☑ Skip Unattended Installation) — 언어·디스크·사용자 화면을 한 번은 보는 게 배움. 자동 설치는 「빨리 하고 싶으면」 상자로 |
| Q2 | 🐢 거북이(Hyper-V 계열과 충돌)가 나오면? | ✅ 기본 안내는 **메모리 무결성 · 가상 머신 플랫폼 끄고 재부팅**(대가와 되돌리는 법 함께). WSL2·Docker 를 계속 써야 하면 「거북이 그대로」 도 선택지로(느리지만 됨) |
| Q3 | VM 에 줄 메모리·CPU | ✅ **메모리 8GB · CPU 4개 · 디스크 40GB**(PC 메모리 16GB 이상 기준 — 64GB PC 면 넉넉). 「PC 메모리의 절반을 넘기지 않기」 규칙을 같이 |
| Q4 | VS Code Remote-SSH 를 넣을까? | ✅ **넣음**(U13) — 운영체제·어셈블리 교과서에서 「Windows 의 VS Code 로 VM 안 코드를 고치고 VM 에서 실행」 이 기본 작업 방식이 됨 |
| Q5 | 코스 이름 | 허브 카드 「리눅스」, 교과서 제목 「리눅스 교과서: 내 PC 안의 우분투에서」 |
