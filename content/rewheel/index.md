---
title: Rewheel
tagline: Bike repair that comes to the rider, with the price shown first
role: Service Design, UX Design, Research, Prototype Build
context: IED Barcelona, Master's thesis
year: 2026
team: Solo thesis project
tools: Figma, Flutter web, Firebase, AI coding tools
live_url: https://rewheel.vercel.app
live_hint: demo data only, no real payments
file_1: Ergenc_Cagdas_Rewheel_Dossier_Draft.docx
file_1_label: Thesis dossier, draft
file_1_note: Word, 2.7 MB
file_2: Ergenc_Cagdas_Rewheel_Financial_Plan.xlsx
file_2_label: Financial plan
file_2_note: Excel, 0.3 MB
lead_image: slide-07-prototype.webp
lead_alt: Deck slide, Tuesday night again, with Rewheel. Four phone screens from the live app follow one night. 21:40 Marc posts a photo of the bike without its wheel. 22:05 two offers, wheel included, one can come at 07:15. 07:15 the mechanic fits a new wheel at the bike. 08:15 they ride to school. A line below reads: Standard, within 48 hours. Next morning, +€7. Within 3 hours, +€15. The mechanic keeps 60% of the extra.
lead_caption: Marc's night in the live prototype. A fault posted at 21:40, two offers by 22:05, a mechanic at the bike at 07:15, school at 08:15. Demo data.
summary_problem: A small bike fault takes the bike away for days. The repair itself is quick. Finding a mechanic, agreeing a price and getting there is where the time goes.
summary_role: I did all of it: the surveys, a repair I timed myself, the service blueprint, the financial model, the app design, and the build with AI coding tools.
summary_output: A marketplace where a mechanic the rider chooses comes to the bike, with the price shown first. A live prototype on demo data, and a 30-day pilot plan.
summary_status: Never run with real users. 7 riders surveyed, 1 repair done by me, 0 paid bookings, no mechanic has accepted the fee yet. The pilot is the next step.
card_type: Mobility · Working prototype
card_description: Getting a bike repaired without losing the week. A mechanic the rider chooses comes to the bike. Solo thesis project, from research to a live app.
card_evidence: 7 riders surveyed · 1 timed repair · Pilot not yet run
pdf_size: 24.2 MB
pdf_pages: 66
featured: true
order: 3
---

## Context
- **What it is:** a marketplace where a mechanic comes to the rider's bike. The rider sees the price first and chooses who comes.
- **Why it exists:** my Master's thesis in Strategic Design Management at IED Barcelona. Defence on 15 December 2026.
- **Who did it:** me, alone. Research, service design, the interface and the working app.

## Problem
A bike holds a family's morning together. A small fault takes it away for days.

![Deck slide, Someone stole the back wheel. Tuesday, 21:40, Barcelona. School starts at 08:15. Marc found the bike like this at 21:40. His son's helmet is already by the door. His hotel shift starts straight after drop-off. Can Marc find out tonight whether they ride tomorrow? A photo shows a bike locked to a street post with its back wheel missing and a child seat on the back.](slide-01-stolen-wheel.webp "The night the problem starts.")

Marc has three options tonight:
- **Go to the shop.** It opens at 10, when he is already at work. The bike stays for days and he sees the price at the counter.
- **Fix it himself.** He needs a new wheel that fits his bike, tonight.
- **Leave it.** Metro with a child tomorrow, and probably all week.

![Deck slide, Meet Marc. The bike holds his morning together. A father and hotel receptionist with his own bike and a child seat. School at 08:15, work straight after, groceries on the way home. Tonight he can go to the shop, which opens at 10 and keeps the bike for days, fix it himself, which needs a new wheel tonight, or leave it and take the metro with a child. What 7 riders told me: 5 of 7 use the bike for errands or caring for others, 3 of 5 put off a repair because they couldn't find the time, 4 of 7 chose repair where I keep the bike.](slide-02-meet-marc.webp "Marc is fictional, built from my survey of 7 frequent Barcelona riders. I have not interviewed parents yet.")

### How many Marcs
- About **75,000** people ride a bike in Barcelona every day, shared bikes included.
- **2 of 3** bike trips are on a bike somebody owns.
- **7 of 7** riders I surveyed needed attention for a fault at least twice in six months.
- **4 of 7** lost riding days to their last fault. One lost more than two weeks.
- About **30,000** riders on their own bike are within reach in Barcelona. That one is my estimate.

![Deck slide, Marc is not the only one. 75,000 people ride a bike in Barcelona every day. 2 of 3 bike trips are on a bike somebody owns. 7 of 7 riders surveyed needed attention for a fault at least twice in six months. 4 of 7 lost riding days to the last fault, one lost more than two weeks. About 30,000 riders on their own bike are within reach in Barcelona, my estimate.](slide-03-how-many-marcs.webp "Sources on the slide: beteve, the RACC cycling barometer 2025, and my wave 3 survey of 7 riders. The 30,000 is mine.")

## Research
Each test moved the problem closer to the rider.

![Deck slide, I didn't start with Marc. Each test moved the problem closer to him. June, a skills problem: 1 of 8 didn't know if their bike was worth fixing. September, a life problem: 7 of 9 stopped riding because life changed, not the bike. October, a subscription: 0 of 7 chose a monthly fee, 4 of 7 wanted the repair where the bike is kept. November, an access problem: a mechanic the rider chooses comes to the bike and the rider pays per visit.](slide-04-how-i-got-here.webp "Four months, four versions of the problem. Only the last one is about access.")

- **June, a skills problem.** I thought owners needed help fixing their own bike. 1 of 8 did not know if theirs was worth fixing.
- **September, a life problem.** I thought nobody decides what to do with a parked bike. 7 of 9 stopped riding because life changed, not the bike.
- **October, a subscription?** I moved to daily riders and offered a monthly plan. 0 of 7 chose a monthly fee. 4 of 7 wanted the repair where the bike is kept.
- **November, an access problem.** A mechanic the rider chooses comes to the bike. The rider pays per visit.

### The repair I timed
On 28 September a friend's front wheel was stolen, like Marc's. I found a used one and fitted it at their workplace. They rode it the same day.
- **88 minutes** from start to finish.
- **18** of them were diagnosis, repair and checking.
- **70** were coordination, travel and finding the part.

![Deck slide, Journey took 88 minutes. Repair was 18. A bar splits 18 minutes of diagnosis, repair and checking from 70 minutes of coordination, travel and finding the part. Fixing the bike is easy. Getting it fixed is the hard part. How might we bring a mechanic the rider chooses to the bike, before the next ride that matters? A photo shows a rusty chain and crank.](slide-05-88-minutes.webp "Repair log R01, one visit: coordination 10, travel 40, finding the part 20, diagnosis 3, repair 10, check 5 minutes.")

### What already exists
Several already come to your bike. None of them lets the rider choose the mechanic.
- **RACC HolaBICI** comes to the bike on a fixed price list. **MyBike Mobile** comes to the bike with no public prices.
- **Swapfiets** is a rented bike at €15.90 a month, repaired in store.
- **Cyclofix** repaired 300,000 bikes at home in France and closed in 2023. Being useful was not enough.

![Deck slide, comparison table. Local shop: your own bike, does not come to the bike, price at the counter, you do not choose the mechanic. RACC HolaBICI: your own bike, comes to the bike, fixed price list, no choice of mechanic. MyBike Mobile: your own bike, comes to the bike, no public prices, no choice. Swapfiets: rented bike, in store, 15.90 euros a month, no choice. Rewheel: yes to all four.](slide-08-whats-different.webp "Company pages read 17 to 28 October 2026.")

## Insight
Fixing the bike is easy. **Getting it fixed is the hard part.**

- 18 minutes of work sat inside 88 minutes of finding, coordinating and travelling.
- Every parked bike was a ridden bike first.
- The rider needs to know tonight whether they ride tomorrow.

## Solution
**Riding again tomorrow.** A marketplace where the mechanic comes to your bike. You see the price first and you choose who comes.

- **Post the fault.** A photo, where the bike is and when you need it again.
- **Mechanics send offers.** Mechanics nearby answer with their own price and a visit time.
- **Choose and book.** The mechanic fixes the bike where you keep it and sends a photo report.

![Deck slide, Riding again tomorrow. A marketplace where the mechanic comes to your bike. You see the price first and you choose who comes. 1 Post the fault. 2 Mechanics send offers. 3 Choose and book. Pay per visit, no membership. Mechanics set their own price and keep 80% of the labour. If a repair fails, the mechanic comes back, planned.](slide-06-rewheel.webp "Pay per visit, no membership. Mechanics keep 80% of the labour. The repair guarantee is planned, not built.")

### What is built, and what is not
- **Built:** requests, offers, booking and visit reports, running on demo data at rewheel.vercel.app.
- **Designed, not built or tested:** speed options. Standard within 48 hours, next morning for €7 more, within 3 hours for €15 more. In my survey, 5 of 7 riders could wait 2 to 3 days.
- **Planned:** the repair guarantee, and card payments.

### The money
- A rider pays **€66** on an average first job. €36 goes to the mechanic, €15 to parts, €9 stays with Rewheel, €6 covers VAT and costs.
- Winning one rider costs about **€24** in marketing. That rider leaves about **€27** over three years, so **€1.15** back for every €1.
- It only works if riders come back through the app and bring friends.

Every number here comes from my financial plan: three cases, the assumptions and the evidence behind each one. It is linked at the top of this page.

![Deck slide, A rider pays 66 euros. About 9 euros stays with Rewheel. A bar splits the 66 euros: 36 mechanic, 15 parts, 9 Rewheel keeps, 6 VAT and costs. 24 euros of marketing to win one new rider, 27 euros kept from that rider over three years, 1.15 euros back for every 1 euro of marketing.](slide-09-the-money.webp "Every number is an assumption. No rider has paid yet.")

### Two futures from one model
![Deck slide, Same model, two futures. A pilot tells me which one. Expected, my best guess: minus 141 thousand euros in year 5, Barcelona only, about 1,000 jobs a month, never pays for itself. Success, what has to be true: plus 902 thousand euros in year 5, Barcelona then Amsterdam and Paris, about 8,900 jobs a month, covers its monthly costs from month 26. What separates them: second repairs booked in the app 55% to 70%, new riders from 100 jobs 12 to 20, mechanics' price against my list 100% to 110%, booking fee riders accept 3.50 to 4.50 euros.](slide-10-two-futures.webp "In my best guess the business loses money. Four numbers decide whether it works, and the pilot is how I find out.")

## Outcome
Nothing here has been run with real people yet. That is stated on the slides, and it is the point of the next step.

**Real today, as of 18 November:**
- 1 repair, done by me
- 1 working app, live
- 1 interested mechanic
- 7 riders interviewed
- **0 paid bookings.** No mechanic has accepted the 20% fee yet.

### What the app has and has not been through
- **Works:** a full fictional repair cycle on the live app (request, offers, booking review, visit, report), tested on iPhone and Pixel simulators.
- **Not tested yet:** real SMS and email sign-up, photo upload on a real phone, push notifications reaching a phone, one full real repair on two phones, screen readers.
- Demo profiles use fictional data in a private workspace. No real customer, no real payment.

![Deck appendix slide, What is tested, what is not, and what I build next. Tested: a full fictional repair cycle on the live app, iPhone 17 Pro and Pixel 10 Pro simulators, photo storage, security rules and notification backend deployed, consent screen and privacy pages, operator tabs and booking review. Not tested yet: real SMS and email sign-up, photo upload on a real phone, push notifications reaching a phone, one full real repair on two phones, screen readers. Planned: hide phone numbers in chat until booking, my mechanic rebooking, repair record view for each bike, guarantee claim flow, card payments, booking fee and speed tiers, operator pilot summary.](appendix-b09-tested-and-not.webp "From the backup slides. Status as of 18 November 2026.")

### What one repair could change
- **The rider:** the morning still works. School, work and care trips stay on the bike.
- **The mechanic:** paid work nearby, on their own terms. Training couriers and riders on the ten most common faults is planned, not started.
- **The city:** the same bike stays in use. Making a new bike emits 61 to 80 kg CO2e.
- **Measured so far:** one bike back on the road the same day.

![Deck slide, What one repair changes, beyond the bike. The rider: the morning still works. The mechanic: paid work nearby, on their own terms. The city: the same bike stays in use. Measured so far: one bike back on the road the same day. In the pilot I follow every repaired bike at 30 and 90 days, and ask whether a new bike was put off.](slide-11-social-impact.webp "The CO2e figure is from a life-cycle assessment of bicycle production (Dolci et al.).")

### The next step: a 30-day pilot
- **One school, two mechanics, thirty days.**
- **20** requests, **10** with two offers, **5** riders who pay.
- It tests the three biggest unknowns: will riders pay for labour, will a request get two offers, and does the second repair come back to the app.
- I follow every repaired bike at 30 and 90 days.
- What I need: an introduction to two mechanics and one school family group.

![Deck slide, One school, two mechanics, thirty days. Real today: 1 repair done by me, 1 working app live, 1 interested mechanic, 7 riders interviewed, 0 paid bookings. The 30-day pilot: 20 requests, 10 with two offers, 5 riders who pay. I need an introduction to two mechanics and one school family group. At 08:15, did they ride to school?](slide-12-pilot.webp "The closing slide of the thesis pitch. The question it ends on is the one it started with.")
